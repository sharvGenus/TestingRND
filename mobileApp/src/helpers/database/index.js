import SQLite from 'react-native-sqlite-storage';
import uuid from 'react-native-uuid';

import {
    allMasterColumnlistById,
    formAttributeValidations,
    formAttributes,
    formNotifications,
    formNotificationsCount,
    formPermissions,
    formSubtypes,
    formsList,
    getFormAttForTickets,
    getFormAttributesWithAllMasterColumnsName,
    getFormDetailsForTickets,
    getFormMappingTableAndColumn,
    getFormWithInFormIds,
    getMappingDataDetailsForDynamicMasters,
    getSearchQueryWithL2Approval,
    getTableName,
    masterList,
    msaterColumns,
    unreadNotificationsCount,
    visibilityBlockConditions
} from './queries';
SQLite.enablePromise(true);

const operations = {
    et: '=',
    net: '!=',
    gt: '>',
    lt: '<',
    gte: '>=',
    lte: '<='
};

export class Database {
    constructor(dbInstance) {
        this.dbInstance = dbInstance;
        this.dbName = 'genus_power_db_v1';
        this.location = 'default';
        this.draftTable = 'form_submission_draft';
        this.ticketPayload = 'ticket_submissions_payload';
    }

    set db(dbInstance) {
        if (dbInstance) {
            this.dbInstance = dbInstance;
        }
    }

    errorCB(error) {
        console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#42] | [error] | `, error);
    }

    successCB() {
        console.log('SQL executed fine');
    }

    openCB() {
        console.log('Database OPENED');
    }

    async connectDatabse() {
        this.dbInstance = await SQLite.openDatabase({ name: this.dbName, location: this.location });
    }

    async createDraftFormTable() {
        const {
            rows: { length: lengthDraftTable }
        } = await this.executeQuery(`SELECT * FROM pragma_table_info('${this.draftTable}') WHERE name = 'form_type';`, []);
        if (lengthDraftTable === 0) {
            await this.executeQuery(`DROP TABLE IF EXISTS ${this.draftTable};`, []);
            await this.executeQuery(
                `CREATE TABLE IF NOT EXISTS "${this.draftTable}" (
                    "form_responses" TEXT,
                    "form_files_data" TEXT,
                    "form_id" TEXT PRIMARY KEY,
                    "searched_data" TEXT,
                    "searched_key" TEXT,
                    "form_type" TEXT
                );`,
                []
            );
        }
        const {
            rows: { length: lengthTickets }
        } = await this.executeQuery(`SELECT * FROM pragma_table_info('${this.ticketPayload}') WHERE name = 'created_at';`, []);
        if (lengthTickets === 0) {
            await this.executeQuery(`DROP TABLE IF EXISTS ${this.ticketPayload};`, []);
            await this.executeQuery(
                `CREATE TABLE IF NOT EXISTS "${this.ticketPayload}" (
                    "ticket_id" TEXT,
                    "payload" TEXT,
                    "status"  TEXT,
                    "created_at" TEXT
                );`,
                []
            );
        }
        return Promise.resolve();
    }

    async executeQuery(query, arg) {
        const [result] = await this.dbInstance.executeSql(query, arg);
        return result;
    }

    async cteateTableWithQuery(query) {
        return this.executeQuery(query, []);
    }

    async checkIfExists(tablename) {
        const {
            rows: { length }
        } = await this.executeQuery(`PRAGMA table_info(${tablename});`, []);
        return length > 0;
    }

    mapFormValues([key, value]) {
        if (Object.prototype.toString.call(value) === '[object String]') {
            return [key, value.replaceAll("'", "''")];
        } else if (Array.isArray(value)) {
            return [key, value.map((x) => (x?.replaceAll ? x.replaceAll("'", "''") : x))];
        }
        return [key, value];
    }

    async storeDataInLocalData(payload, formId, resurveyId, ticketId) {
        if (payload.form_id && payload.form_responses) {
            const parsedPayload = JSON.parse(payload.form_responses);
            if (!parsedPayload.some(([key]) => key === 'temp_response_id')) {
                parsedPayload.push(['temp_response_id', uuid.v4()]);
                payload.form_responses = JSON.stringify(parsedPayload);
            }
            const columns = Object.keys(payload);
            const query = `INSERT OR REPLACE INTO local_form_submissions ("${columns.join('", "')}", "resurvey_id")
                VALUES ('${columns
                    .map((key) =>
                        key === 'form_responses'
                            ? JSON.stringify(JSON.stringify(JSON.parse(payload[key]).map(this.mapFormValues)))
                            : payload[key]
                    )
                    .join("', '")}', '${resurveyId || ''}')
            `;
            await this.executeQuery(query, []);
            if (resurveyId && !ticketId) {
                const {
                    rows: { raw }
                } = await this.executeQuery(`SELECT * FROM forms WHERE id='${formId}'`);
                const [{ table_name: table }] = raw();
                await this.executeQuery(`DELETE FROM ${table} WHERE id='${resurveyId}'`);
            }
            return [undefined, 200];
        }
        throw new Error('Something went wrong');
    }

    async storeDataInDraft(payload) {
        if (payload.form_id && payload.form_responses) {
            const columns = Object.keys(payload);
            const query = `INSERT OR REPLACE INTO ${this.draftTable} ("${columns.join('", "')}")
                VALUES ('${columns
                    .map((key) =>
                        key === 'form_responses'
                            ? JSON.stringify(Object.fromEntries(Object.entries(payload[key]).map(this.mapFormValues)))
                            : payload[key]
                    )
                    .join("', '")}')
            `;
            await this.executeQuery(query, []);
            return [undefined, 200];
        }
    }

    async deleteDataFromDraft(id) {
        if (id) {
            return this.executeQuery(`DELETE FROM ${this.draftTable} WHERE form_id='${id}'`, []);
        }
    }

    async getAllFormAttributes() {
        const {
            rows: { raw }
        } = await this.executeQuery("SELECT id, name FROM all_masters_list WHERE name IN ('serial_numbers', 'nonserialize_materials')", []);
        return raw().reduce((pre, cur) => {
            pre[cur.id] = cur.name;
            return pre;
        }, {});
    }

    async deleteConsumedSerialNumbers(ids) {
        return this.executeQuery(`UPDATE serial_numbers SET consumed=true WHERE id IN ('${ids.join("', '")}')`, []);
    }

    async reduceConsumedNonserializedMaterial(id, value) {
        return this.executeQuery(`UPDATE nonserialize_materials SET quantity=${value} WHERE id = '${id}'`, []);
    }

    async getDraftData(id, formType = 'normal') {
        const query = `SELECT * FROM ${this.draftTable} WHERE form_id='${id}' AND form_type = '${formType}'`;
        const {
            rows: { raw, length }
        } = await this.executeQuery(query, []);
        return length > 0
            ? raw().map((x) => {
                if (x.form_responses) x.form_responses = JSON.parse(x.form_responses);
                return x;
            })[0]
            : undefined;
    }

    async getDraftDataForTickets(id, ticket_id, formType) {
        const query = `SELECT * FROM ${this.draftTable} WHERE form_id='${id}' AND ticket_id = '${ticket_id}' AND form_type = '${formType}'`;
        const {
            rows: { raw, length }
        } = await this.executeQuery(query, []);
        return length > 0
            ? raw().map((x) => {
                if (x.form_responses) x.form_responses = JSON.parse(x.form_responses);
                return x;
            })[0]
            : undefined;
    }

    async getAllFormsToSync(formId = null, id = null, duplicateCheck = false) {
        let query = 'SELECT * FROM local_form_submissions';
        let where = false;
        if (formId) {
            where = true;
            query += ` WHERE form_id='${formId}'`;
        }
        if (id) {
            query += ` ${where ? ' AND ' : ' WHERE '} id ${duplicateCheck ? '<>' : '='} '${id}'`;
        }
        const {
            rows: { raw, length }
        } = await this.executeQuery(query, []);
        return length > 0
            ? raw().map((x) => {
                if (x.form_responses) x.form_responses = JSON.parse(x.form_responses);
                if (x.form_files_data) x.form_files_data = JSON.parse(x.form_files_data);
                return x;
            })
            : [];
    }

    async getAllTicketsToSync() {
        let query = `SELECT * FROM ${this.ticketPayload} ORDER BY created_at ASC`;
        const {
            rows: { raw, length }
        } = await this.executeQuery(query, []);
        return {
            length,
            ...(length > 0 && {
                rows: raw().map((x) => {
                    try {
                        return { ticketId: x.ticket_id, payload: JSON.parse(x.payload), created_at: x.created_at };
                    } catch (error) {
                        return { ticketId: x.ticket_id, payload: {}, created_at: x.created_at };
                    }
                })
            })
        };
    }

    async deleteTicketData(ticketId, timestamp) {
        return this.executeQuery(`DELETE FROM ${this.ticketPayload} WHERE ticket_id = '${ticketId}' and created_at='${timestamp}'`);
    }

    async getAllFormsToList(formId = null) {
        const data = await this.getAllFormsToSync(formId);
        let i = 0;
        const result = [];
        const seperator = ' - ';
        while (i < data.length) {
            const obj = {};
            const keysDone = [];
            const row = data[i];
            obj.id = row.id;
            obj.form_id = row.id;
            obj.data = {};
            JSON.parse(row.form_responses || '[]').forEach(([key, value]) => {
                if (key.includes(seperator) && !keysDone.includes(key)) {
                    const realKey = key.split(seperator)[0];
                    if (!obj.data[realKey]) {
                        obj.data[realKey] = [];
                    }
                    obj.data[realKey].push(value);
                    keysDone.push(key);
                    return;
                }
                if (obj.data[key] && !Array.isArray(obj.data[key])) {
                    obj.data[key] = [obj.data[key]];
                }
                if (Array.isArray(obj.data[key])) {
                    if (!obj.data[key].includes(value)) obj.data[key].push(value);
                } else {
                    obj.data[key] = value;
                }
            });
            result.push(obj);
            i += 1;
        }
        return result;
    }

    async getSearchMappedData(formId, value, ticketId, isUsingId) {
        try {
            const getFormQuery = getFormMappingTableAndColumn.replace('conditionalId', formId);
            const formsMappingTableWithAllColumsn = getFormAttributesWithAllMasterColumnsName.replace('conditaionId', formId);
            let hasDropDownCondition = false;
            const {
                rows: { raw, length }
            } = await this.executeQuery(getFormQuery, []);
            let hasL2ApprovalStatus = false;
            let l2ApprovalQuery = '';
            if (length > 0) {
                // oldNewMappingColumn
                const [{ tableName: originalFormTableName, mappingTableId, searchColumns: actualSeachColumns, selfSearchColumns }] = raw();
                const searchColumns = ticketId ? selfSearchColumns : actualSeachColumns;
                const masterTableQuery = getTableName.replace('conditionalId', mappingTableId);
                const {
                    rows: { raw: rawTable, length: lengthTable }
                } = await this.executeQuery(masterTableQuery, []);
                let [{ tableName }] = lengthTable > 0 ? rawTable() : [{ tableName: null }];
                let isDynamicMaster = false;
                let mappingDetatils = [];
                if (!tableName) {
                    const queryToExecute = getMappingDataDetailsForDynamicMasters.replace('conditionalId', formId);
                    const {
                        rows: { raw: rawForm, length: lengthForm }
                    } = await this.executeQuery(queryToExecute, []);
                    mappingDetatils = lengthForm > 0 ? rawForm() : [];
                    mappingDetatils = mappingDetatils.filter((x, index, self) => {
                        return (
                            x.key_name &&
                            x.mapping_column &&
                            x.mapping_table &&
                            self.findIndex((y) => y.mapping_column === x.mapping_column) === index
                        );
                    });
                    tableName = ticketId ? originalFormTableName : mappingDetatils[0]?.mapping_table;
                    isDynamicMaster = true;
                }
                const {
                    rows: { raw: rawNewMappingColumn, length: lengthNewMappingColumn }
                } = await this.executeQuery(
                    `
                    SELECT
                        fa.id,
                        da.input_type AS input_type,
                        fa.column_name AS fa_column_name,
                        fa.properties
                    FROM
                        form_attributes AS fa
                    INNER JOIN forms ON forms.id = fa.form_id
                    INNER JOIN default_attributes AS da ON da.id = fa.default_attribute_id
                    WHERE
                        forms.table_name = '${originalFormTableName}'
                    `,
                    []
                );
                let oldMeterMappingQuery = undefined;
                if (lengthNewMappingColumn > 0) {
                    const newMappingColumn = this.getFormListsRows(rawNewMappingColumn);
                    await Promise.all(
                        newMappingColumn.map(async (x) => {
                            if (x.input_type === 'dropdown') {
                                const { sourceTable, sourceColumn } = x.properties;
                                const [
                                    {
                                        rows: { raw: rawTable }
                                    },
                                    {
                                        rows: { raw: rawColumn }
                                    }
                                ] = await Promise.all([
                                    this.executeQuery(`SELECT name AS tablename from all_masters_list WHERE id='${sourceTable}'`, []),
                                    this.executeQuery(`SELECT name AS columnname from all_master_columns WHERE id='${sourceColumn}'`, [])
                                ]);
                                const [{ tablename }] = rawTable();
                                const [{ columnname }] = rawColumn();
                                x.sourceTable = tablename;
                                x.columnName = columnname;
                            }
                            return x;
                        })
                    );
                    const oldNewMappingColumn = newMappingColumn
                        .map((x) => {
                            const {
                                id,
                                input_type,
                                fa_column_name,
                                properties: { oldNewMappingColumn: _oldNewMappingColumn }
                            } = x.properties ? x : { properties: {} };
                            const index = newMappingColumn.findIndex((y) => y.id === _oldNewMappingColumn);
                            if (index > -1) {
                                return {
                                    id,
                                    attribute_name: fa_column_name,
                                    mapped_attribute: newMappingColumn?.[index]?.fa_column_name,
                                    input_type,
                                    mapped_input_type: newMappingColumn?.[index]?.input_type,
                                    mapped_source_table: newMappingColumn?.[index]?.sourceTable,
                                    mapped_source_column: newMappingColumn?.[index]?.columnName
                                };
                            }
                            return false;
                        })
                        .filter((x) => x);
                    oldMeterMappingQuery = oldNewMappingColumn.reduce((pre, cur, index) => {
                        if (cur.input_type === 'text' && cur.mapped_input_type === 'dropdown') {
                            const aliasJoin = `${cur.mapped_source_table}_${cur.mapped_attribute}`;
                            pre += ` ${aliasJoin}.${cur.mapped_source_column} AS ${cur.attribute_name} `;
                        } else {
                            pre += ` ${cur.mapped_attribute} AS ${cur.attribute_name}`;
                        }
                        if (pre !== '' && index < oldNewMappingColumn.length - 1) pre += ',';
                        return pre;
                    }, '');
                    if (oldMeterMappingQuery) {
                        // oldMeterMappingQuery = `SELECT * FROM serial_numbers`;
                        oldMeterMappingQuery = `SELECT ${tableName}.id, ${oldMeterMappingQuery} FROM ${tableName}`;

                        oldMeterMappingQuery = oldNewMappingColumn.reduce((pre, cur) => {
                            if (cur.mapped_input_type === 'dropdown') {
                                const tableJoin = cur.mapped_source_table;
                                const aliasJoin = `${cur.mapped_source_table}_${cur.mapped_attribute}`;
                                pre += ` INNER JOIN ${tableJoin} AS ${aliasJoin} ON REPLACE(REPLACE(${cur.mapped_attribute}, '{', ''), '}', '') = ${aliasJoin}.ID`;
                            }
                            return pre;
                        }, oldMeterMappingQuery);
                    }
                }
                let mappedColumns = null;
                if (isDynamicMaster && tableName) {
                    mappedColumns = mappingDetatils.map((x) => ({ all_master_column: { name: x.mapping_column }, columnName: x.key_name }));
                } else {
                    const {
                        rows: { raw: rawColumn, length: lengthColumn }
                    } = await this.executeQuery(formsMappingTableWithAllColumsn, []);
                    mappedColumns = lengthColumn > 0 ? this.getFormListsRows(rawColumn) : [];
                }
                let [...restColumns] = await Promise.all([
                    ...searchColumns
                        .replace('{', '')
                        .replace('}', '')
                        .split(',')
                        .map(async (id) => {
                            const searchColumnsQuery = isDynamicMaster
                                ? `SELECT column_name as name, properties, default_attributes.input_type as type  FROM form_attributes 
                                INNER JOIN default_attributes ON default_attributes.id = form_attributes.default_attribute_id
                                WHERE form_attributes.id='${id}'`
                                : allMasterColumnlistById.replace('conditionalId', id);
                            const {
                                rows: { raw: rawSearch, length: lengthSearch }
                            } = await this.executeQuery(searchColumnsQuery, []);
                            const [{ name, properties, type }] = lengthSearch > 0 ? rawSearch() : [{ name: undefined }];
                            return Promise.resolve({ name, properties, type });
                        })
                ]);

                let dropdownColumns = restColumns.filter((x) => x.type === 'dropdown');
                restColumns = restColumns.filter((x) => x.type !== 'dropdown');
                let isResurvey = false;
                if (tableName.startsWith('zform_')) {
                    const {
                        rows: { length }
                    } = await this.executeQuery(
                        `SELECT fa.column_name AS attribute_name FROM forms AS f INNER JOIN form_attributes AS fa ON fa.form_id = f.id WHERE  f.table_name = '${tableName}' AND fa.column_name = 'is_resurvey'`,
                        []
                    );
                    isResurvey = length === 1;

                    const {
                        rows: { raw: rawL2ApprovalQuery, length: lengthL2ApprovalQuery }
                    } = await this.executeQuery(getSearchQueryWithL2Approval.replace('conditionalId', tableName), []);
                    hasL2ApprovalStatus = lengthL2ApprovalQuery > 0;
                    const [{ subquery } = {}] = rawL2ApprovalQuery();
                    l2ApprovalQuery = subquery;
                }
                let resultQuery = `SELECT * FROM ${tableName} WHERE ${hasL2ApprovalStatus && !isUsingId ? l2ApprovalQuery : ''} ${isResurvey && !isUsingId ? "(is_resurvey IS NULL OR LOWER(is_resurvey) <> 'yes') AND (" : !isUsingId ? '(' : ''}`;
                let addOrMark = false;
                if (!isUsingId && dropdownColumns.length > 0) {
                    dropdownColumns = await Promise.all(
                        dropdownColumns.map(async (x) => {
                            const properties = JSON.parse(x.properties);
                            const { sourceTable, sourceColumn } = properties;
                            const [
                                {
                                    rows: { raw: rawTable }
                                },
                                {
                                    rows: { raw: rawColumn }
                                }
                            ] = await Promise.all([
                                this.executeQuery(`SELECT name AS tablename from all_masters_list WHERE id='${sourceTable}'`, []),
                                this.executeQuery(`SELECT name AS columnname from all_master_columns WHERE id='${sourceColumn}'`, [])
                            ]);
                            const [{ tablename }] = rawTable();
                            const [{ columnname }] = rawColumn();
                            const {
                                rows: { raw: result }
                            } = await this.executeQuery(
                                `SELECT id FROM ${tablename} WHERE ${columnname} COLLATE NOCASE LIKE '${value}'`,
                                []
                            );
                            const records = result();
                            return { [x.name]: records.map((x) => x.id) };
                        })
                    );
                    dropdownColumns.forEach((x) => {
                        const [[key, _value]] = Object.entries(x);
                        _value.forEach((y) => {
                            resultQuery += ` ${addOrMark ? ' OR ' : ''} ${key} COLLATE NOCASE LIKE '%${y}%'`;
                            if (!hasDropDownCondition) hasDropDownCondition = true;
                            addOrMark = true;
                        });
                    });
                }
                if (isUsingId) {
                    resultQuery += `id = '${value}' `;
                } else {
                    resultQuery += `${addOrMark && restColumns.length > 0 ? ' OR ' : ''} ${restColumns
                        .map(({ name, type }) => {
                            if (type === 'number' && Number.isNaN(parseFloat(value))) return '';
                            return `${name} ${type === 'number' ? '=' : 'COLLATE NOCASE LIKE'} '${type === 'number' ? parseFloat(value) : value}'`;
                        })
                        .filter((x) => x)
                        .join(' OR ')} ${isDynamicMaster ? ')' : ") AND is_active = '1'"}`;
                }
                if (!resultQuery.includes(value) && !hasDropDownCondition) return [[], hasL2ApprovalStatus ? 'No Approved Record Found!' : 'No Record Found!'];
                const {
                    rows: { raw: rawResult, length: lengthResult }
                } = await this.executeQuery(resultQuery, []);
                let oldMeterMappingData = [];
                const getSqlData = rawResult();
                if (ticketId && oldMeterMappingQuery && getSqlData.length > 0) {
                    const idsToFetch = getSqlData.map((x) => x.id);
                    const {
                        rows: { raw: result }
                    } = await this.executeQuery(`${oldMeterMappingQuery} WHERE ${tableName}.id IN ('${idsToFetch.join("', '")}')`, []);
                    const oldMeterMapping = result();
                    oldMeterMappingData = oldMeterMapping.reduce((pre, cur) => {
                        pre[cur.id] = cur;
                        return pre;
                    }, {});
                }
                if (ticketId) {
                    mappedColumns.push({
                        all_master_column: {
                            name: 'id'
                        },
                        columnName: 'id'
                    });
                }
                getSqlData.forEach((x) => {
                    if (oldMeterMappingData[x.id]) {
                        Object.entries(oldMeterMappingData[x.id]).forEach(([key, _value]) => {
                            x[key] = _value;
                            mappedColumns.push({
                                all_master_column: {
                                    name: key
                                },
                                columnName: key
                            });
                        });
                    }
                });

                if (lengthResult > 0) {
                    const data = this.reduceDataByKeys(getSqlData, mappedColumns, !!ticketId);
                    return [{ data, visibleData: data }, ''];
                }
            }
            return [[], hasL2ApprovalStatus ? 'No Approved Record Found!' : 'No Record Found!'];
        } catch (error) {
            console.log('error', error);
            return [[], hasL2ApprovalStatus ? 'No Approved Record Found!' : 'No Record Found!'];
        }
    }

    reduceDataByKeys(data, replaceKeyArray, isSelfTableSearch) {
        return data.map((item) =>
            replaceKeyArray.reduce((acc, replaceItem) => {
                const {
                    all_master_column: { name },
                    columnName: replaceName
                } = replaceItem;
                const keyToFind = !isSelfTableSearch ? name : replaceName;
                if (item[keyToFind]) {
                    if (typeof item[keyToFind] === 'string' && item[keyToFind]?.includes?.('{') && item[keyToFind]?.includes?.('}')) {
                        item[keyToFind] = item[keyToFind].replace('{', '').replace('}', '').split(',');
                    }
                    acc[replaceName] = item[keyToFind];
                }
                return acc;
            }, {})
        );
    }

    async deleteSubmittedForm([key, value]) {
        const query = `DELETE FROM local_form_submissions WHERE "${key}"='${value}'`;
        return this.executeQuery(query, []);
    }

    async dropTableFromDB(tableName) {
        return this.executeQuery(`DROP TABLE IF EXISTS "${tableName}";`);
    }

    async getDropDownLovsData(payLoad) {
        try {
            const dropdownQueries = [];
            let startIndex = 0;
            const maxLength = payLoad.formDropdowns.length;
            while (startIndex < maxLength) {
                const endIndex = Math.min(startIndex + 5, maxLength);
                const chunk = payLoad.formDropdowns.slice(startIndex, endIndex);
                const result = await Promise.all(chunk.map(async (obj) => this.getFormMastersLov(obj)));
                dropdownQueries.push(...result);
                startIndex = endIndex;
            }
            const goupedDropDownQuries = [];
            const emptySets = [];
            const sourceColumnById = {};
            dropdownQueries.forEach((arg) => {
                const { selectClause, matchingColum, fieldName, query, tableName, dependency, sourceColumn, conditions, sourceTableId } =
                    arg;
                const index = goupedDropDownQuries.findIndex((_arg) => {
                    const {
                        query: _query,
                        tableName: _tableName,
                        fieldName: _fieldName,
                        conditions: _conditions,
                        sourceTableId: _sourceTableId
                    } = _arg;
                    return (
                        _fieldName === dependency &&
                        tableName === _tableName &&
                        _query === query &&
                        conditions?.length &&
                        _conditions?.length &&
                        _sourceTableId === sourceTableId &&
                        JSON.stringify(conditions) === JSON.stringify(_conditions)
                    );
                });
                if (index === -1) {
                    return goupedDropDownQuries.push(arg);
                }
                if (!Object.hasOwn(goupedDropDownQuries[index], 'otherSelectClauses')) {
                    goupedDropDownQuries[index].otherSelectClauses = [];
                }
                goupedDropDownQuries[index].otherSelectClauses.push({ selectClause, matchingColum, fieldName, dependency, conditions });
                sourceColumnById[sourceColumn] = selectClause;
                emptySets.push({ [fieldName]: [] });
            });
            const finalQuery = [];
            goupedDropDownQuries.forEach(
                ({ selectClause, fieldName, query, sqlQuery, tableName, matchingColum, otherSelectClauses = [] }) => {
                    const selectOther = otherSelectClauses.reduce((pre, cur) => {
                        if (cur.selectClause && cur.fieldName) {
                            pre += `, "${cur.selectClause}": "' || ${cur.selectClause} || '"`;
                        }
                        return pre;
                    }, '');
                    const matchingColumCluase = matchingColum ? `, "matchingcolumn": "' || ${matchingColum} || '"` : '';
                    finalQuery.push({
                        [fieldName]: `SELECT DISTINCT 
                            CASE 
                                WHEN '{"id": "' || id || '", "name": "' || ${selectClause} || '"${selectOther}${matchingColumCluase}}' IS NOT NULL THEN 
                                    '{"id": "' || id || '", "name": "' || ${selectClause} || '"${selectOther}${matchingColumCluase}}'
                                ELSE '"null"' 
                            END AS "${fieldName}"
                            FROM ${tableName} ${query}${sqlQuery}; `
                    });
                }
            );

            const dropDownList = await Promise.all(
                finalQuery.map(async (obj) => {
                    const [[field, query]] = Object.entries(obj);
                    let value = [];
                    try {
                        const {
                            rows: { raw }
                        } = await this.executeQuery(query);
                        value = raw();
                        if (value.length === 0) {
                            return { [field]: [] };
                        }
                        const arr = [];
                        value.forEach((x) => {
                            try {
                                arr.push(JSON.parse(Object.values(x)[0].replace(/\s+(?=\")/g, '')));
                            } catch (error) {
                                // console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#468] | [x] | `, x);
                            }
                        });
                        return { [field]: arr };
                    } catch (error) {
                        console.log(
                            `> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#432] | [error, query] | `,
                            error,
                            query
                        );
                        return { [field]: [] };
                    }
                })
            );
            dropDownList.push(...emptySets);
            return { dropDownList, sourceColumnById };
        } catch (error) {
            console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#398] | [error] | `, error);
            return { dropDownList: [], sourceColumnById: {} };
        }
    }

    async getFormMastersLov({
        name: fieldName,
        conditions,
        sourceColumn,
        sourceTable,
        extraColumn,
        factoryTable,
        factoryColumn,
        linkColumn,
        attribute_id,
        isEditOrResurvey,
        existingValue,
        formArributes,
        dependency: dependencyUuid
    }) {
        const isFactory = !!(factoryTable && factoryColumn && linkColumn && sourceColumn);
        const queryMasterTable = masterList.replace('conditionalId', sourceTable);
        const queryMasterColumn = msaterColumns.replace('conditionalId', sourceColumn);
        const [tableName, columnName] = await Promise.all([
            (async () => {
                const {
                    rows: { raw, length }
                } = await this.executeQuery(queryMasterTable, []);
                const [{ name, table_type }] = length > 0 ? raw() : [{ name: undefined }];
                return Promise.resolve({ name, table_type });
            })(),
            (async () => {
                const {
                    rows: { raw, length }
                } = await this.executeQuery(queryMasterColumn, []);
                const [{ name }] = length > 0 ? raw() : [{ name: undefined }];
                return Promise.resolve(name);
            })()
        ]);
        let exstingValueString = '';
        if (tableName.name === 'nonserialize_materials' && isEditOrResurvey && existingValue && formArributes) {
            try {
                const [valueStoreIn] = formArributes
                    .filter((x) =>
                        x.validations?.attribute_validation_conditions?.some((x) => x.compareWithFormAttributeId === attribute_id)
                    )
                    .map((x) => x?.columnName);
                exstingValueString = ` + ${existingValue[valueStoreIn]}`;
            } catch (error) {
                console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#438] | [error] | `, error);
            }
        }

        let matchingColum;
        if (extraColumn) {
            const querySearchColumn = msaterColumns.replace('conditionalId', extraColumn);
            const {
                rows: { raw, length }
            } = await this.executeQuery(querySearchColumn, []);
            const [{ name }] = length > 0 ? raw() : [{ name: undefined }];
            if (name) {
                matchingColum = name;
            }
        }
        const selectClause = `${isFactory ? 'factory_value' : columnName}${exstingValueString}`;
        // const nameForWhere = ['nonserialize_materials', 'serial_numbers', 'serialize_material_type'].includes(tableName.name) ? selectClause : 'name'
        let query = ` WHERE`;
        const andClause = (x) => (x !== ' WHERE' ? 'AND' : '');
        if (tableName.name === 'serial_numbers' && !isEditOrResurvey) {
            query += `${andClause(query)} (consumed is null OR consumed <> 1) `;
        }
        if (tableName.table_type === 'function') {
            query += `${andClause(query)} fromattributeid = '${attribute_id}' `;
        }
        if (conditions && conditions.length > 0) {
            query += `${andClause(query)} `;
            let searchColumns = await Promise.all(
                conditions.map(async (obj) => {
                    const querySearchColumn = msaterColumns.replace('conditionalId', obj.column);
                    const {
                        rows: { raw, length }
                    } = await this.executeQuery(querySearchColumn, []);
                    const [{ name }] = length > 0 ? raw() : [{ name: undefined }];
                    if (!name) return undefined;
                    return { [name]: ` ${name} ${operations[obj.operation]} '${obj.value}' ` };
                })
            );
            searchColumns = searchColumns.filter((x) => x);
            searchColumns = searchColumns.reduce((pre, cur) => {
                const [[key, value]] = Object.entries(cur);
                if (!pre[key]) pre[key] = [];
                pre[key].push(value);
                return pre;
            }, {});
            query += Object.entries(searchColumns)
                .map(([key, value]) => {
                    return `(${value.join(' OR ')})`;
                })
                .join(' AND ');
        }
        let dependency;
        if (dependencyUuid) {
            const {
                rows: { raw }
            } = await this.executeQuery(`SELECT fa.name AS faname FROM form_attributes AS fa WHERE fa.id = '${dependencyUuid}'`);
            const [{ faname }] = raw();
            dependency = faname;
        }
        query = query === ' WHERE' ? '' : query;
        return {
            selectClause,
            matchingColum,
            dependency,
            fieldName,
            query,
            sqlQuery: '',
            tableName: tableName.name,
            sourceColumn,
            conditions,
            sourceTableId: sourceTable
        };
    }

    async getLoggedInUser() {
        const {
            rows: { raw: loggedInUser }
        } = await this.executeQuery(`SELECT * FROM users WHERE logged_in_user = true`, []);
        const [user] = loggedInUser();
        return user;
    }

    async getFormList(isOandM) {
        const user = await this.getLoggedInUser();
        const [results, permissions, ticketForms] = await Promise.all([
            (async () => {
                const {
                    rows: { raw }
                } = await this.executeQuery(formsList, []);
                return this.getFormListsRows(raw);
            })(),
            (async () => {
                const {
                    rows: { raw }
                } = await this.executeQuery(formPermissions, []);
                const permissions = this.getFormListsRows(raw);
                return permissions.map((x) => x.id);
            })(),
            (async () => {
                if (!isOandM) return [];
                const { rows: { raw } } = await this.executeQuery(`
                    SELECT p.forms FROM tickets AS t INNER JOIN project_wise_ticket_mappings AS p ON t.project_wise_mapping_id = p.id WHERE t.assignee_id = '${user.id}';
                `, []);
                let _ticketForms = raw().map(y => y.forms?.replace(/["{}]/g, '').split(',')).flat();
                _ticketForms = Array.from(new Set(_ticketForms))
                return _ticketForms;
            })()
        ]);
        const rows = results.filter((x) => permissions.includes(x.id) || ticketForms.includes(x.id));
        const submissionCount = await Promise.allSettled(
            rows.map(async ({ id, tableName, form_attributes }) => {
                return Promise.all([
                    (async () => {
                        const {
                            rows: { raw }
                        } = await this.executeQuery(
                            `SELECT COUNT(form_id) AS total FROM local_form_submissions WHERE form_id='${id}' GROUP BY form_id;`,
                            []
                        );
                        return raw();
                    })(),
                    (async () => {
                        if (form_attributes.some((x) => x.columnName === 'is_resurvey')) {
                            const {
                                rows: { length: resurvey }
                            } = await this.executeQuery(
                                `SELECT * FROM ${tableName} WHERE LOWER(is_resurvey) = 'yes' AND resurvey_by COLLATE NOCASE LIKE '%${user.id}%' GROUP BY id`,
                                []
                            );
                            return [{ resurvey }];
                        }
                        return [{ resurvey: 0 }];
                    })()
                ]);
            })
        );
        rows.forEach((x, i) => {
            x.submissions = {
                offline: submissionCount[i]?.value?.[0]?.[0]?.total || 0,
                resurvey: submissionCount[i]?.value[1]?.[0]?.resurvey || 0
            };
        });
        return { rows };
    }

    async getFormSubtypes() {
        const {
            rows: { raw }
        } = await this.executeQuery(formSubtypes, []);
        return this.getFormListsRows(raw);
    }

    async getFormNotifications() {
        const user = await this.getLoggedInUser();
        const [
            {
                rows: { raw }
            },
            {
                rows: { raw: rawCount }
            },
            {
                rows: { raw: unreadCount }
            }
        ] = await Promise.all([
            this.executeQuery(formNotifications.replace('where_condition', user.id), []),
            this.executeQuery(formNotificationsCount.replace('where_condition', user.id), []),
            this.executeQuery(unreadNotificationsCount.replace('where_condition', user.id), [])
        ]);
        const data = this.getFormListsRows(raw);
        return {
            rows: data,
            unreadCount: unreadCount()?.[0]?.count,
            count: rawCount()?.[0]?.count
        };
    }

    async getTicketInfoList(object) {
        const { formId, forms: formsArray, mobileFields, geoLocationField, responseId } = object;
        const formAttrArray = JSON.parse(JSON.stringify(mobileFields));
        if (geoLocationField) {
            if (typeof geoLocationField === 'object') formAttrArray.push(...geoLocationField);
            else if (typeof geoLocationField === 'string') formAttrArray.push(geoLocationField);
        }
        const [
            {
                rows: { raw: rawForm }
            },
            {
                rows: { raw: rawFormsArray }
            },
            {
                rows: { raw: rawFormAtt }
            }
        ] = await Promise.all([
            this.executeQuery(getFormDetailsForTickets.replace('where_condition', formId), []),
            this.executeQuery(getFormWithInFormIds.replace('where_condition', formsArray.join("', '")), []),
            this.executeQuery(getFormAttForTickets.replace('where_condition', formAttrArray.join("', '")), [])
        ]);

        const [form] = this.getFormListsRows(rawForm);
        const formList = this.getFormListsRows(rawFormsArray);
        const formAttributes = this.getFormListsRows(rawFormAtt);
        const { tableName } = form;
        const fields = formAttributes.map((x) => `${x.columnName} AS "${x.name}"`).join(', ');
        const geoLocationKey = formAttributes.find((x) => x.id === geoLocationField)?.name;
        const {
            rows: { raw: responseRaw }
        } = await this.executeQuery(`SELECT ${fields} FROM ${tableName} WHERE id = '${responseId}'`, []);
        const [response] = responseRaw();
        const responseData = {};
        Object.entries(response || {}).forEach(([key, value]) => {
            responseData[key] =
                value && typeof value === 'string' && value.startsWith('{') ? value.replace(/["{}]/g, '').split(',') : value;
        });
        return { formList, geoLocationKey, responseData, project: form.project };
    }

    async updateNotifications() {
        return this.executeQuery(`UPDATE forms_notifications SET is_read = true`, [])
    }

    async updateTicketStatus(payload, ticketId) {
        const {
            rows: { raw }
        } = await this.executeQuery(`SELECT * FROM tickets WHERE id = '${ticketId}'`);
        const [existingTicket] = raw();
        if (payload.ticketStatus === 'in-progress') {
            const {
                rows: { length, raw }
            } = await this.executeQuery(
                `SELECT * FROM tickets WHERE id != '${ticketId}' AND ticket_status = 'in-progress' AND assignee_id = '${existingTicket.assignee_id}'`,
                []
            );
            if (length > 0) throw new Error('User already have an In-Progress ticket');
        }
        existingTicket.ticket_status = payload.ticketStatus;
        existingTicket.assignee_remarks = payload.assigneeRemarks;
        if (payload.assigneeId === null) {
            if (existingTicket.supervisor_id === existingTicket.assignee_id) {
                // ticket was assigned to supervisor
                existingTicket.supervisor_id = null;
                existingTicket.assignee_type = null;
                existingTicket.assignee_type = 'nomc';
                await this.executeQuery(
                    `
                    UPDATE tickets SET ticket_status='${payload.ticketStatus}', assignee_remarks='${payload.assigneeRemarks}' WHERE id = '${ticketId}'
                `,
                    []
                );
                await this.executeQuery(
                    `
                    DELETE FROM forms_notifications WHERE response_id='${existingTicket.response_id}' AND ticket_id='${ticketId}' AND category='handt'
                `,
                    []
                );
            } else {
                existingTicket.assignee_type = null;
                if (existingTicket.assignee_type === 'installer') {
                    existingTicket.assignee_type = 'nomc';
                    await this.executeQuery(
                        `
                        DELETE FROM forms_notifications WHERE response_id='${existingTicket.response_id}' AND ticket_id='${ticketId}' AND category='handt'
                    `,
                        []
                    );
                } else if (existingTicket.assignee_type === 'supervisor') {
                    existingTicket.assignee_id = existingTicket.supervisor_id;
                    await this.executeQuery(`DELETE FROM tickets WHERE id='${ticketId}'`, []);
                }
            }
        }
        await this.executeQuery(
            `
            UPDATE tickets SET ${Object.entries(existingTicket)
                .map(([key, value]) => {
                    const finalValue = typeof value === 'string' ? `'${value}'` : value;
                    return `${key}=${finalValue}`;
                })
                .join(', ')} WHERE id = '${ticketId}'
            `,
            []
        );
        await this.executeQuery(
            `
            INSERT INTO ${this.ticketPayload} (ticket_id, payload, status, created_at) VALUES ('${ticketId}', '${JSON.stringify(
                payload
            )}', '${payload.ticketStatus}', '${Date.now()}')
        `,
            []
        );
        return true;
    }

    async getResurveryForms(formId, offset, limit) {
        const user = await this.getLoggedInUser();
        const query = `SELECT * FROM forms WHERE id='${formId}'`;
        const {
            rows: { raw }
        } = await this.executeQuery(query, []);
        const [{ table_name: table }] = raw();
        const [{ rows: { raw: resurvey } }, { rows: { raw: resurveyCount } }] = await Promise.all([
            this.executeQuery(
                `SELECT * FROM ${table} WHERE LOWER(is_resurvey) = 'yes' AND resurvey_by COLLATE NOCASE LIKE '%${user.id}%' limit ${limit} offset ${offset}`,
                []
            ),
            this.executeQuery(
                `SELECT count(*) AS count FROM ${table} WHERE LOWER(is_resurvey) = 'yes' AND resurvey_by COLLATE NOCASE LIKE '%${user.id}%'`,
                []
            )
        ]);
        const rows = this.getFormListsRows(resurvey, undefined, true);
        return { count: resurveyCount()?.count, data: rows.map((x) => ({ data: x })) };
    }

    async getFormsAttributes(id) {
        const query = formAttributes.replace('conditionalId', id);
        const {
            rows: { raw }
        } = await this.executeQuery(query, []);
        const rows = this.getFormListsRows(raw);
        const visibilityData = await this.mapVisibilities(id);
        const _visibilityData = await Promise.all(
            visibilityData.map(async (item) => {
                if (
                    Array.isArray(item?.attribute_visibility_conditions) &&
                    item?.attribute_visibility_conditions.length > 0 &&
                    formAttributes
                ) {
                    item.attribute_visibility_conditions = await Promise.all(
                        item?.attribute_visibility_conditions.map(async (x) => {
                            let formAttributeQuery = formAttributes.replace('conditionalId', x?.fromAttributeId);
                            formAttributeQuery = formAttributeQuery.replace(
                                'AND "form_attributes"."form_id"',
                                'AND "form_attributes"."id"'
                            );
                            const {
                                rows: { raw: formAttributesResult }
                            } = await this.executeQuery(formAttributeQuery, []);
                            const formAtt = this.getFormListsRows(formAttributesResult);
                            if (formAtt && Array.isArray(formAtt) && formAtt.length > 0) {
                                x.form_attribute = formAtt[0];
                            }
                            return x;
                        })
                    );
                }
                return Promise.resolve(item);
            })
        );
        await Promise.all(
            rows.map(async (item) => {
                item.validations = await this.mapFormValidationsWithAttributes(item.id);
                item.showConditions = _visibilityData.filter((x) => x.visible_columns.includes(item.id));
                item.hideConditions = _visibilityData.filter((x) => x.non_visible_columns.includes(item.id));
                return item;
            })
        );
        return { rows };
    }

    async mapVisibilities(id) {
        const query = visibilityBlockConditions.replace('conditionalId', id);
        const {
            rows: { raw }
        } = await this.executeQuery(query, []);
        const rows = this.getFormListsRows(raw, 'attribute_visibility_conditions.id');
        return rows.map((x) => {
            if (x.non_visible_columns) {
                x.non_visible_columns = x.non_visible_columns.split(',');
            }
            if (x.visible_columns) {
                x.visible_columns = x.visible_columns.split(',');
            }
            return x;
        });
    }

    async mapFormValidationsWithAttributes(id) {
        const query = formAttributeValidations.replace('conditionalId', id);
        const {
            rows: { length, raw }
        } = await this.executeQuery(query, []);
        if (!length) return null;
        const [rows] = this.getFormListsRows(raw);
        if (rows?.attribute_validation_conditions) {
            rows.attribute_validation_conditions = await Promise.all(
                rows.attribute_validation_conditions.map(async (x) => {
                    const [formArr, compareWithAtt] = await Promise.all([
                        (async () => {
                            if (!x.fromAttributeId) return null;
                            let query = formAttributes.replace('conditionalId', x.fromAttributeId);
                            query = query.replace('AND "form_attributes"."form_id"', 'AND "form_attributes"."id"');
                            const {
                                rows: { raw }
                            } = await this.executeQuery(query, []);
                            const [rows] = this.getFormListsRows(raw);
                            return rows;
                        })(),
                        (async () => {
                            if (x.compareWithFormAttributeId) {
                                let query = formAttributes.replace('conditionalId', x.compareWithFormAttributeId);
                                query = query.replace('AND "form_attributes"."form_id"', 'AND "form_attributes"."id"');
                                const {
                                    rows: { raw }
                                } = await this.executeQuery(query, []);
                                const [rows] = this.getFormListsRows(raw);
                                return rows;
                            }
                            return null;
                        })()
                    ]);
                    return { ...x, form_attribute: formArr, ...(compareWithAtt && { compare_with_column: compareWithAtt }) };
                })
            );
        }
        return rows;
    }

    setReccurssiveObjectKeys(object, path, value) {
        if (!this.isObject(object)) {
            return { ...object };
        }
        path = path.split('.');
        const { length } = path;
        const lastIndex = length - 1;

        let index = -1;
        let nested = object;
        while (nested != null && ++index < length) {
            const key = path[index];
            let newValue = value;
            if (index !== lastIndex) {
                const objValue = nested[key];
                newValue = objValue;
            }
            nested[key] = newValue;
            nested = nested[key];
        }
        return object;
    }

    isObject(value) {
        const type = typeof value;
        return value != null && (type === 'object' || type === 'function');
    }

    getFormListsRows(raw, compareKey, allArray = false) {
        let i = -1;
        let rows = [];
        const allRows = raw();
        const indexArr = [];
        while (++i < allRows.length) {
            const row = allRows[i];
            const allValues = Object.entries(row);
            const index = rows.findIndex((x) => x.id === row.id);
            const indexToPark = index === -1 ? indexArr.length : index;
            if (index === -1) {
                rows[indexToPark] = {};
            }
            allValues.forEach(([key, value]) => {
                const arrKey = key.split('.');
                const [mainKey, ...rest] = arrKey;
                /**
                 * Convert string true false in to booleans and stringified object to parsed object
                 */
                if (arrKey.length >= 1 && arrKey.includes('properties') && value) {
                    value = JSON.parse(value);
                } else if (['true', 'false'].includes(value)) {
                    value = value === 'true';
                }
                if (key.includes('.')) {
                    /**
                     * Identify the keys is exist or not if not then add blank object or array
                     */
                    if (!Object.prototype.hasOwnProperty.call(rows[indexToPark], mainKey)) {
                        rows[indexToPark][mainKey] = [
                            'form_attributes',
                            'attribute_validation_conditions',
                            'attribute_visibility_conditions'
                        ].includes(mainKey)
                            ? []
                            : {};
                    }

                    if (mainKey === 'ticket') {
                        const splitKeys = key.split('.');
                        const [, nestedObject, nestedKey] = splitKeys;
                        if (
                            key.split('.').length > 2 &&
                            ['form_wise_ticket_mapping', 'project_wise_ticket_mapping'].includes(nestedObject)
                        ) {
                            try {
                                if (!rows[indexToPark][mainKey][nestedObject]) {
                                    rows[indexToPark][mainKey][nestedObject] = {};
                                }
                                rows[indexToPark][mainKey][nestedObject][nestedKey] =
                                    value && value.startsWith('{') ? value.replace(/["{}]/g, '').split(',') : value;
                                return;
                            } catch (error) {
                                console.log(error);
                                return;
                            }
                        }
                    }

                    /**
                     * If type is object and then add new key in that object.
                     */
                    if (Object.prototype.toString.call(rows[indexToPark][mainKey]) === '[object Object]') {
                        rows[indexToPark] = this.setReccurssiveObjectKeys(rows[indexToPark], key, value);
                    }
                    if (Object.prototype.toString.call(rows[indexToPark][mainKey]) === '[object Array]') {
                        const compareWith = compareKey
                            ? row[compareKey]
                            : row['form_attributes.id'] || row['attribute_validation_conditions.id'] || row['all_master_column.id'];
                        const ind = rows[indexToPark][mainKey].findIndex((x) => !x.id || x.id === compareWith);
                        const indToParkForInnerArray = ind === -1 ? rows[indexToPark][mainKey].length : ind;
                        if (!rows[indexToPark][mainKey][indToParkForInnerArray]) {
                            rows[indexToPark][mainKey][indToParkForInnerArray] = {};
                        }
                        if (!rows[indexToPark][mainKey][indToParkForInnerArray].default_attribute) {
                            rows[indexToPark][mainKey][indToParkForInnerArray].default_attribute = {};
                        }
                        rows[indexToPark][mainKey][indToParkForInnerArray] = JSON.parse(
                            JSON.stringify(
                                this.setReccurssiveObjectKeys(rows[indexToPark][mainKey][indToParkForInnerArray], rest.join('.'), value)
                            )
                        );
                    }
                } else {
                    rows[indexToPark][key] =
                        allArray && value && value.startsWith && value.startsWith('{') ? value.replace(/["{}]/g, '').split(',') : value;
                }
            });
            if (!indexArr.includes(row.id)) indexArr.push(row.id);
        }

        return rows.map((row) => {
            const allKeys = Object.keys(row);
            let key = 0;
            while (key <= allKeys.length) {
                const value = row[allKeys[key]];
                if (
                    Object.prototype.toString.call(value) === '[object Object]' &&
                    Object.values(value).every((x) => [null, undefined].includes(x))
                ) {
                    row[allKeys[key]] = null;
                }
                key++;
            }
            return row;
        });
    }

    async getUniqueRecordsCounts(tablename, column, unique = false, getRecords = false) {
        const [count, records] = await Promise.all([
            (async () => {
                const {
                    rows: { raw }
                } = await this.executeQuery(
                    `SELECT SUM(result.total) as count FROM (SELECT ${column}, COUNT(${column}) AS total FROM ${tablename} GROUP BY ${column} HAVING COUNT(${column}) ${unique ? '=' : '>'} 1) AS result`,
                    []
                );
                const [{ count }] = raw();
                return +count;
            })(),
            (async () => {
                if (getRecords) {
                    const {
                        rows: { raw }
                    } = await this.executeQuery(
                        `SELECT ${column} FROM ${tablename} GROUP BY ${column} HAVING COUNT(${column}) ${unique ? '=' : '>'} 1`,
                        []
                    );
                    const records = raw();
                    return records.map((x) => x[column]);
                }
                return [];
            })()
        ]);
        return { count, records };
    }

    static dbInstance() {
        return new Database();
    }
}
