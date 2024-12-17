// Swager API doc for /rural-level-entry/create and controller function createFirm
/**
 * @swagger
 * /rural-level-entry/create:
 *  post:
 *     tags:
 *     - Rural Level Entry
 *     summary: Create a new ruralLevelEntry
 *     description: Create a new ruralLevelEntry
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
 *              ruralHierarchyId:
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

// Swager API doc for /rural-level-entry/update/:id and controller function updateRuralLevelEntries
/**
 * @swagger
 * /rural-level-entry/update/{id}:
 *  put:
 *     tags:
 *     - Rural Level Entry
 *     summary: Update a ruralLevelEntry by id  
 *     description: Update a ruralLevelEntry by id
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
 *              ruralHierarchyId:
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

// Swager API doc for /rural-level-entry/details/:id and controller function getRuralLevelEntriesDetails
/**
 * @swagger
 * /rural-level-entry/details/{id}:
 *  get:
 *     tags:
 *     - Rural Level Entry
 *     summary: Returns a rural Level Entry by id  
 *     description: Returns a rural Level Entry by id
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

// Swager API doc for /rural-level-entry/list and controller function getAllRuralLevelEntries
/**
 * @swagger
 * /rural-level-entry/list:
 *  get:
 *     tags:
 *     - Rural Level Entry
 *     summary: Returns all rural Level Entry  
 *     description: Return all rural Level Entry
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

// Swager API doc for /rural-level-entry/delete/:id and controller function deleteAllRuralLevelEntries
/**
 * @swagger
 * /rural-level-entry/delete/{id}:
 *  delete:
 *     tags:
 *     - Rural Level Entry
 *     summary: Delete a rural Level Entry by id  
 *     description: Delete a rural Level Entry by id
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

// Swager API doc for /rural-level-entry/dropdown/:id and controller function getAllRuralLevelEntryByDropdown
/**
 * @swagger
 * /rural-level-entry/dropdown/{id}:
 *  get:
 *     tags:
 *     - Rural Level Entry
 *     summary: Returns a rural level entry by id  
 *     description: Returns a rural level entry by id
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

// Swager API doc for /rural-level-entry/history/:recordId and controller function getRuralLevelEntryHistory
/**
 * @swagger
 * /rural-level-entry/history/{recordId}:
 *  get:
 *     tags:
 *     - Rural Level Entry
 *     summary: Returns a rural level entry by id  
 *     description: Returns a rural level entry by id
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