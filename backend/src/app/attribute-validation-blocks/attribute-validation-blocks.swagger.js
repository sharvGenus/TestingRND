// Swager API doc for /attribute-validation-block/create and controller function createAttributeValidationBLocks
/**
 * @swagger
 * /attribute-validation-block/create:
 *  post:
 *     tags:
 *     - Attribute Validation Block
 *     summary: Create a new Attribute Validation Block. 
 *     description: Create a new Attribute Validation Block.  In this in the "conditionsArray" key , we need to pass the array of objects in which operatorKey, compareWithValue, isActive, compareWithFormAttributeId, fromAttributeId and json of properties will be passed for the entry of attribute_validation_condition table. As many as objects will be passed it will bulkCreate those objects in the table along with formId mapped in it.
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              type:
 *                type: string
 *              message:
 *                type: string
 *              formId:
 *                type: string 
 *                format: uuid
 *              isPublised:
 *                type: boolean
 *              conditionsArray:
 *                type: array
 *              active:
 *                type: string
 *                enum: [0, 1]
 *                default: 1
 *     responses:
 *      200:
 *        description: Created
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Forbidden
 *      409:
 *        description: Duplicate
 *      500:
 *        description: Internal Error
 */

// Swager API doc for /attribute-validation-block/update/:id and controller function updateAttributeValidationBLocks
/**
 * @swagger
 * /attribute-validation-block/update/{id}:
 *  put:
 *     tags:
 *     - Attribute Validation Block
 *     summary: Update a Attribute Validation Block by id  
 *     description: Update a Attribute Validation Block by id
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type : string
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              type:
 *                type: string
 *              message:
 *                type: string
 *              active:
 *                type: string
 *                enum: [0, 1]
 *                default: 1
 *     responses:
 *      200:
 *        description: Updated
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Internal Error
 */

// Swager API doc for /attribute-validation-block/list and controller function getAllAttributeValidationBlocks
/**
 * @swagger
 * /attribute-validation-block/list:
 *  get:
 *     tags:
 *     - Attribute Validation Block
 *     summary: Returns all Attribute Validation Block  
 *     description: Return all Attribute Validation Block
 *     parameters:
 *      - name: formID
 *        in: query
 *        schema:
 *          type : string
 *     responses:
 *      200:
 *        description: a JSON Object
 *        schema:
 *          type: object
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Internal Error
 */

// Swager API doc for /attribute-validation-block/delete/:id and controller function deleteAttributeValidationBLocks
/**
 * @swagger
 * /attribute-validation-block/delete/{id}:
 *  delete:
 *     tags:
 *     - Attribute Validation Block
 *     summary: Delete a Attribute Validation Block by id  
 *     description: Delete a Attribute Validation Block by id
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type : string
 *     responses:
 *      200:
 *        description: a JSON Object
 *        schema:
 *          type: object
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Internal Error
 */

// Swager API doc for /attribute-validation-block/update and controller function updateBlockAndConditions
/**
 * @swagger
 * /attribute-validation-block/update:
 *  post:
 *     tags:
 *     - Attribute Validation Block
 *     summary: Update Attribute Validation Block. 
 *     description: Update Attribute Validation Block.  In this in the "conditionsArray" key , we need to pass the array of objects in which operatorKey, compareWithValue, fromAttributeId, isActive, compareWithFormAttributeId and json of properties will be passed for the entry of attribute_validation_condition table. As many as objects will be passed it will bulkCreate those objects in the table along with formId mapped in it. In this if you want to update the any existing attribute then you need to pass the id of that id in its object in the conditionsArray.
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              type:
 *                type: string
 *              message:
 *                type: string
 *              formId:
 *                type: string 
 *                format: uuid
 *              isPublised:
 *                type: boolean
 *              conditionsArray:
 *                type: array of objects
 *              active:
 *                type: string
 *                enum: [0, 1]
 *                default: 1
 *     responses:
 *      200:
 *        description: Created
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Forbidden
 *      409:
 *        description: Duplicate
 *      500:
 *        description: Internal Error
 */