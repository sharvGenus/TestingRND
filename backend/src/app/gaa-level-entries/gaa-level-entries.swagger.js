// Swager API doc for /gaa-level-entry/create and controller function creategaaLevelEntry
/**
 * @swagger
 * /gaa-level-entry/create:
 *  post:
 *     tags:
 *     - Gaa Level Entry
 *     summary: Create a new gaa level entry
 *     description: Create a new gaa level entry
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              integrationId:
 *                type: string
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              gaaHierarchyId:
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

// Swager API doc for /gaa-level-entry/update/:id and controller function updateGaaLevelEntry
/**
 * @swagger
 * /gaa-level-entry/update/{id}:
 *  put:
 *     tags:
 *     - Gaa Level Entry
 *     summary: Update a gaa level entry by id  
 *     description: Update a gaa level entry by id
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
 *              integrationId:
 *                type: string
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              gaaHierarchyId:
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

// Swager API doc for /gaa-level-entry/details/:id and controller function getGaaLevelEntryDetails
/**
 * @swagger
 * /gaa-level-entry/details/{id}:
 *  get:
 *     tags:
 *     - Gaa Level Entry
 *     summary: Returns a gaa level entry by id  
 *     description: Returns a gaa level entry by id
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

// Swager API doc for /gaa-level-entry/list and controller function getAllGaaLevelEntries
/**
 * @swagger
 * /gaa-level-entry/list:
 *  get:
 *     tags:
 *     - Gaa Level Entry
 *     summary: Returns all firms  
 *     description: Return all firms
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

// Swager API doc for /gaa-level-entry/delete/:id and controller function deleteGaaLevelEntry
/**
 * @swagger
 * /gaa-level-entry/delete/{id}:
 *  delete:
 *     tags:
 *     - Gaa Level Entry
 *     summary: Delete a gaa level entry by id  
 *     description: Delete a gaa level entry by id
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

// Swager API doc for /gaa-level-entry/dropdown/:id and controller function getAllGaaLevelEntryByDropdown
/**
 * @swagger
 * /gaa-level-entry/dropdown/{id}:
 *  get:
 *     tags:
 *     - Gaa Level Entry
 *     summary: Returns a gaa level entry by id  
 *     description: Returns a gaa level entry by id
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

// Swager API doc for /gaa-level-entry/history/:recordId and controller function getGaaLevelEntryHistory
/**
 * @swagger
 * /gaa-level-entry/history/{recordId}:
 *  get:
 *     tags:
 *     - Gaa Level Entry
 *     summary: Returns a gaa level entry by id  
 *     description: Returns a gaa level entry by id
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