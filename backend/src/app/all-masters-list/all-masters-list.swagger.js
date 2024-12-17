// Swager API doc for /all-masters-list/create and controller function createAllMastersList
/**
 * @swagger
 * /all-masters-list/create:
 *  post:
 *     tags:
 *     - All Masters List
 *     summary: Create a new All Masters List
 *     description: Create a new All Masters List
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
 *              accessFlag:
 *                type: boolean
 *              parent:
 *                type: string
 *              grandParent:
 *                type: string
 *              parentRank:
 *                type: integer
 *              grandParentRank:
 *                type: integer
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

// Swager API doc for /all-masters-list/update/:id and controller function updateAllMastersList
/**
 * @swagger
 * /all-masters-list/update/{id}:
 *  put:
 *     tags:
 *     - All Masters List
 *     summary: Update a All Masters List by id
 *     description: Update a All Masters List by id
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
 *              accessFlag:
 *                type: boolean
 *              parent:
 *                type: string
 *              grandParent:
 *                type: string
 *              parentRank:
 *                type: integer
 *              grandParentRank:
 *                type: integer
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

// Swager API doc for /all-masters-list/details/:id and controller function getAllMastersListDetails
/**
 * @swagger
 * /all-masters-list/details/{id}:
 *  get:
 *     tags:
 *     - All Masters List
 *     summary: Returns a All Masters List by id
 *     description: Returns a All Masters List by id
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

// Swager API doc for /all-masters-list/list and controller function getAllCountries
/**
 * @swagger
 * /all-masters-list/list:
 *  get:
 *     tags:
 *     - All Masters List
 *     summary: Returns all countries
 *     description: Return all countries
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

// Swager API doc for /all-masters-list/delete/:id and controller function deleteAllMastersList
/**
 * @swagger
 * /all-masters-list/delete/{id}:
 *  delete:
 *     tags:
 *     - All Masters List
 *     summary: Delete a All Masters List by id
 *     description: Delete a All Masters List by id
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
