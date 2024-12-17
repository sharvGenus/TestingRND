// Swager API doc for /all-master-columns-list/create and controller function createAllMasterColumnsList
/**
 * @swagger
 * /all-master-columns-list/create:
 *  post:
 *     tags:
 *     - All Master Columns List
 *     summary: Create a new All Master Columns List
 *     description: Create a new All Master Columns List
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              visibleName:
 *                type: string
 *              masterId:
 *                type: string
 *                format: uuid
 *              isActive:
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

// Swager API doc for /all-master-columns-list/update/:id and controller function updateAllMasterColumnsList
/**
 * @swagger
 * /all-master-columns-list/update/{id}:
 *  put:
 *     tags:
 *     - All Master Columns List
 *     summary: Update a All Master Columns List by id
 *     description: Update a All Master Columns List by id
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
 *              visibleName:
 *                type: string
 *              masterId:
 *                type: string
 *                format: uuid
 *              isActive:
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

// Swager API doc for /all-master-columns-list/details/:id and controller function getAllMasterColumnsListDetails
/**
 * @swagger
 * /all-master-columns-list/details/{id}:
 *  get:
 *     tags:
 *     - All Master Columns List
 *     summary: Returns a All Master Columns List by id
 *     description: Returns a All Master Columns List by id
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

// Swager API doc for /all-master-columns-list/list and controller function getAllMasterColumnslistByMasterId
/**
 * @swagger
 * /all-master-columns-list/list/{masterId}:
 *  get:
 *     tags:
 *     - All Master Columns List
 *     summary: Returns all master columns list by masterId
 *     description: Return all master columns list by masterId
  *     parameters:
 *      - name: masterId
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

// Swager API doc for /all-master-columns-list/delete/:id and controller function deleteAllMasterColumnsList
/**
 * @swagger
 * /all-master-columns-list/delete/{id}:
 *  delete:
 *     tags:
 *     - All Master Columns List
 *     summary: Delete a All Master Columns List by id
 *     description: Delete a All Master Columns List by id
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
