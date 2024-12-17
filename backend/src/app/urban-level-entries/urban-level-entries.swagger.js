// Swager API doc for /urban-level-entry/create and controller function createurbanLevelEntry
/**
 * @swagger
 * /urban-level-entry/create:
 *  post:
 *     tags:
 *     - Urban Level Entry
 *     summary: Create a new urban level entry
 *     description: Create a new urban level entry
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
 *              urbanHierarchyId:
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

// Swager API doc for /urban-level-entry/update/:id and controller function updateUrbanLevelEntry
/**
 * @swagger
 * /urban-level-entry/update/{id}:
 *  put:
 *     tags:
 *     - Urban Level Entry
 *     summary: Update a urban level entry by id  
 *     description: Update a urban level entry by id
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
 *              urbanHierarchyId:
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

// Swager API doc for /urban-level-entry/details/:id and controller function getUrbanLevelEntryDetails
/**
 * @swagger
 * /urban-level-entry/details/{id}:
 *  get:
 *     tags:
 *     - Urban Level Entry
 *     summary: Returns a urban level entry by id  
 *     description: Returns a urban level entry by id
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

// Swager API doc for /urban-level-entry/list and controller function getAllUrbanLevelEntries
/**
 * @swagger
 * /urban-level-entry/list:
 *  get:
 *     tags:
 *     - Urban Level Entry
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

// Swager API doc for /urban-level-entry/delete/:id and controller function deleteUrbanLevelEntry
/**
 * @swagger
 * /urban-level-entry/delete/{id}:
 *  delete:
 *     tags:
 *     - Urban Level Entry
 *     summary: Delete a urban level entry by id  
 *     description: Delete a urban level entry by id
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

// Swager API doc for /urban-level-entry/dropdown/:id and controller function getAllUrbanLevelEntryByDropdown
/**
 * @swagger
 * /urban-level-entry/dropdown/{id}:
 *  get:
 *     tags:
 *     - Urban Level Entry
 *     summary: Returns a urban level entry by id  
 *     description: Returns a urban level entry by id
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

// Swager API doc for /urban-level-entry/history/:recordId and controller function getUrbanLevelEntryHistory
/**
 * @swagger
 * /urban-level-entry/history/{recordId}:
 *  get:
 *     tags:
 *     - Urban Level Entry
 *     summary: Returns a urban level entry by id  
 *     description: Returns a urban level entry by id
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