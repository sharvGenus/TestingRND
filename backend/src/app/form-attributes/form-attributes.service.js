/* eslint-disable max-len */
/* eslint-disable camelcase */

const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const FormsAttributes = require("../../database/operation/form-attributes");
const { addKeyValuePairToObject } = require("../../utilities/common-utils");
const { getMappedDataWithConditionsAndFormAttributes } = require("../attribute-validation-blocks/attribute-validation-blocks.service");
const { getVisibilityFromAttributeId } = require("../attribute-visibility-blocks/attribute-visibility-blocks.service");
const AttributeValidationConditions = require("../../database/operation/attribute-validation-conditions");
const AttributeVisibilityConditions = require("../../database/operation/attribute-visibility-conditions");
const AttributeValidationBlocks = require("../../database/operation/attribute-validation-blocks");

const formAttributeAlreadyExists = async (where) => {
    try {
        const formAttributes = new FormsAttributes();
        const data = await formAttributes.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FORMATTRIBUTES_ALREADY_EXIST, error);
    }
};

const createformAttributes = async (formAttributeDetails) => {
    try {
        const formAttributes = new FormsAttributes();
        const data = await formAttributes.create(formAttributeDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_FORMATTRIBUTES_FAILURE, error);
    }
};
const updateformAttributes = async (formDetails, where) => {
    try {
        const formAttributes = new FormsAttributes();
        const data = await formAttributes.update(formDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FORMATTRIBUTES_UPDATE_FAILURE, error);
    }
};

const getAllformAttributes = async (where) => {
    try {
        const formAttributes = new FormsAttributes();
        const data = await formAttributes
            .findAndCountAll(where, undefined, true, undefined, undefined, false, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_FORMATTRIBUTES_LIST_FAILURE, error);
    }
};
const deleteformAttributes = async (where) => {
    try {
        const formAttributes = new FormsAttributes();
        const data = await formAttributes.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_FORMATTRIBUTES_FAILURE, error);
    }
};
const getformAttributesByCondition = async (where) => {
    try {
        const formAttributes = new FormsAttributes();
        const data = await formAttributes.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FORMATTRIBUTES_FAILURE, error);
    }
};

const createFormAttributesWithForm = async (formAttributeData, formId) => {
    try {
        const formAttributes = new FormsAttributes();
        const requiredObject = addKeyValuePairToObject(formAttributeData, "formId", formId);
        const data = await formAttributes.bulkCreate(requiredObject.map((x) => ({ ...x, name: x.name[0].toUpperCase() + x.name.slice(1, x.name.length), columnName: x.columnName?.trim()?.toLowerCase() })));
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FORMATTRIBUTES_FAILURE, error);
    }
};

const updateExistingFormAttributes = async (formAttributeData, isFormPublished) => {
    try {
        const formAttributes = new FormsAttributes();
        const attriValCondition = new AttributeValidationConditions();
        const attriVisCondition = new AttributeVisibilityConditions();
        const attriValBlock = new AttributeValidationBlocks();
        const updates = formAttributeData.map(async (formData) => {
            const { id, ...updateData } = formData;
            const where = { id };
            if (updateData.isActive === 0 && !isFormPublished) {
                await attriValCondition.forceDelete({ fromAttributeId: where.id });
                await attriValBlock.forceDelete({ primaryColumn: where.id });
                await attriVisCondition.forceDelete({ fromAttributeId: where.id });
                await formAttributes.forceDelete(where);
                return;
            } else if (updateData.isActive === 0 && isFormPublished) {
                return formAttributes.update({ isActive: "0" }, where);
            }
            delete updateData.formId; // Delete the formId property from updateData
            return formAttributes.update({ ...updateData, name: updateData.name[0].toUpperCase() + updateData.name.slice(1, updateData.name.length), columnName: updateData.columnName?.trim()?.toLowerCase() }, where);
        });
        return Promise.all(updates);
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FORMATTRIBUTES_FAILURE, error);
    }
};

const mapDataWithAttribute = async (data) => {
    const formAttributes = new FormsAttributes();
    const requiredData = await Promise.all(
        data.map(async (obj) => {
            let attributesData = await getMappedDataWithConditionsAndFormAttributes({ primaryColumn: obj.id });
            if (attributesData) {
                attributesData = JSON.parse(JSON.stringify(attributesData));
                attributesData.attribute_validation_conditions = await Promise.all(
                    attributesData.attribute_validation_conditions.map(async (x) => {
                        const [formArr, compareWithAtt] = await Promise.all([
                            (async () => {
                                if (x.form_attribute) {
                                    return formAttributes.findOne({ id: x.form_attribute.id }, undefined, true, undefined, undefined, undefined, true);
                                }
                                return null;
                            })(),
                            (async () => {
                                if (x.compare_with_column?.id) {
                                    return formAttributes.findOne({ id: x.compare_with_column.id }, undefined, true, undefined, undefined, undefined, true);
                                }
                                return null;
                            })()
                        ]);
                        return ({
                            ...JSON.parse(JSON.stringify(x)),
                            form_attribute: JSON.parse(JSON.stringify(formArr)),
                            ...compareWithAtt && { compare_with_column: JSON.parse(JSON.stringify(compareWithAtt)) }
                        });
                    })
                );
            }

            let attributesVisibilityData = await getVisibilityFromAttributeId(obj.id);
            if (attributesVisibilityData) {
                attributesVisibilityData = JSON.parse(JSON.stringify(attributesVisibilityData));

                // Process showConditions and attribute_visibility_conditions
                const processVisibilityConditions = async (conditions) => {
                    if (conditions?.length > 0) {
                        return Promise.all(conditions.map(async (obj) => {
                            let { attribute_visibility_conditions } = obj;
                            if (attribute_visibility_conditions?.length > 0) {
                                attribute_visibility_conditions = JSON.parse(JSON.stringify(attribute_visibility_conditions));
                                attribute_visibility_conditions = await Promise.all(attribute_visibility_conditions.map(async (x) => {
                                    if (x.form_attribute) {
                                        const formAttributeData = await formAttributes.findOne({ id: x.form_attribute.id }, undefined, true, undefined, undefined, undefined, true);
                                        if (formAttributeData) {
                                            return { ...x, form_attribute: formAttributeData };
                                        }
                                    }
                                    return null;
                                }));
                            }
                            return { ...obj, attribute_visibility_conditions };
                        }));
                    }
                    return null;
                };

                attributesVisibilityData.showConditions = await processVisibilityConditions(attributesVisibilityData.showConditions);
                attributesVisibilityData.hideConditions = await processVisibilityConditions(attributesVisibilityData.hideConditions);
            }

            return { ...obj, validations: attributesData, ...attributesVisibilityData };
        })
    );
    return requiredData;
};

const updateMappingDataInFormAttributes = async (data) => {
    await Promise.all(
        data.map(async (obj) => {
            const { formAttributeId: id, mappingColumnId } = obj;
            await updateformAttributes({ mappingColumnId }, { id });
        })
    );
};

const getMappedFormedAttributeData = async (where, isUpdateRelation) => {
    try {
        const formAttributes = new FormsAttributes();
        const attributes = ["columnName"];
        if (!isUpdateRelation) {
            formAttributes.updateRelations();
        }
        const data = await formAttributes.findAll(where, attributes, !isUpdateRelation, false, undefined, true);
        return isUpdateRelation ? data.map(({ columnName }) => ({ columnName, all_master_column: { name: columnName } })) : data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FORMATTRIBUTES_FAILURE, error);
    }
};

const deleteformAttributesByFormId = async (where, transaction, isDeleted) => {
    try {
        const formAttributes = new FormsAttributes();
        const data = await formAttributes.delete(where, transaction, isDeleted);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_FORMATTRIBUTES_FAILURE, error);
    }
};

const getFormAttributesByForm = async (where, attributes = undefined) => {
    try {
        const formAttributes = new FormsAttributes();
        const data = await formAttributes.findAll(where, attributes, true, true, undefined, true);
        return { rows: data };
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FORMATTRIBUTES_FAILURE, error);
    }
};

const getActiveInactiveRecords = async (where, attributes = undefined, paranoid = false) => {
    try {
        const formAttributes = new FormsAttributes({ listType: "2" });
        const data = await formAttributes.findAll(where, attributes, true, true, undefined, true, true, false);
        return { rows: data };
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FORMATTRIBUTES_FAILURE, error);
    }
};

module.exports = {
    formAttributeAlreadyExists,
    createformAttributes,
    updateformAttributes,
    getAllformAttributes,
    deleteformAttributes,
    getformAttributesByCondition,
    createFormAttributesWithForm,
    updateExistingFormAttributes,
    mapDataWithAttribute,
    updateMappingDataInFormAttributes,
    getMappedFormedAttributeData,
    deleteformAttributesByFormId,
    getFormAttributesByForm,
    getActiveInactiveRecords
};
