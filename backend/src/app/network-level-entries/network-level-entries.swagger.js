// Swager API doc for /network-level-entry/create and controller function createFirm
/**
 * @swagger
 * /network-level-entry/create:
 *  post:
 *     tags:
 *     - Network Level Entry
 *     summary: Create a new networkLevelEntry
 *     description: Create a new networkLevelEntry
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              integrationId:
 *                 type: string
 *              networkHierarchyId:
 *                 type: string
 *                 format: uuid
 *              remarks:
 *                 type: string
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

// Swager API doc for /network-level-entry/update/:id and controller function updateNetworkLevelEntries
/**
 * @swagger
 * /network-level-entry/update/{id}:
 *  put:
 *     tags:
 *     - Network Level Entry
 *     summary: Update a networkLevelEntry by id  
 *     description: Update a networkLevelEntry by id
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
 *              code:
 *                type: string
 *              integrationId:
 *                 type: string
 *              networkHierarchyId:
 *                 type: string
 *                 format: uuid
 *              remarks:
 *                 type: string
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

// Swager API doc for /network-level-entry/details/:id and controller function getNetworkLevelEntriesDetails
/**
 * @swagger
 * /network-level-entry/details/{id}:
 *  get:
 *     tags:
 *     - Network Level Entry
 *     summary: Returns a network Level Entry by id  
 *     description: Returns a network Level Entry by id
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

// Swager API doc for /network-level-entry/list and controller function getAllNetworkLevelEntries
/**
 * @swagger
 * /network-level-entry/list:
 *  get:
 *     tags:
 *     - Network Level Entry
 *     summary: Returns all network Level Entry  
 *     description: Return all network Level Entry
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

// Swager API doc for /network-level-entry/delete/:id and controller function deleteAllNetworkLevelEntries
/**
 * @swagger
 * /network-level-entry/delete/{id}:
 *  delete:
 *     tags:
 *     - Network Level Entry
 *     summary: Delete a network Level Entry by id  
 *     description: Delete a network Level Entry by id
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

// Swager API doc for /network-level-entry/dropdown/:id and controller function getAllNetworkLevelEntryByDropdown
/**
 * @swagger
 * /network-level-entry/dropdown/{id}:
 *  get:
 *     tags:
 *     - Network Level Entry
 *     summary: Returns a network level entry by id  
 *     description: Returns a network level entry by id
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

// Swager API doc for /network-level-entry/history/:recordId and controller function getNetworkLevelEntryHistory
/**
 * @swagger
 * /network-level-entry/history/{recordId}:
 *  get:
 *     tags:
 *     - Network Level Entry
 *     summary: Returns a network level entry by id  
 *     description: Returns a network level entry by id
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