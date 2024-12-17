// Swager API doc for /master-maker/create and controller function createMasterMaker
/**
 * @swagger
 * /master-maker/create:
 *  post:
 *     tags:
 *     - Master Maker
 *     summary: Create a new master maker
 *     description: Create a new master maker
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
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

// Swager API doc for /master-maker/update/:id and controller function updateMasterMaker
/**
 * @swagger
 * /master-maker/update/{id}:
 *  put:
 *     tags:
 *     - Master Maker
 *     summary: Update a master maker by id
 *     description: Update a master maker by id
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

// Swager API doc for /master-maker/details/:id and controller function getMasterMakerDetails
/**
 * @swagger
 * /master-maker/details/{id}:
 *  get:
 *     tags:
 *     - Master Maker
 *     summary: Returns a master maker by id
 *     description: Returns a master maker by id
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

// Swager API doc for /master-maker/list and controller function getAllMasterMaker
/**
 * @swagger
 * /master-maker/list:
 *  get:
 *     tags:
 *     - Master Maker
 *     summary: Returns all master maker
 *     description: /master-maker/list?sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: sort
 *        in: query
 *        schema:
 *          type : array
 *          items:
 *            type: string
 *          example: ["updatedAt", "DESC"]
 *      - name: rowPerPage
 *        in: query
 *        schema:
 *          type : integer
 *        example: 10
 *      - name: pageNumber
 *        in: query
 *        schema:
 *          type : integer
 *        example: 1
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

// Swager API doc for /master-maker/delete/:id and controller function deleteMasterMaker
/**
 * @swagger
 * /master-maker/delete/{id}:
 *  delete:
 *     tags:
 *     - Master Maker
 *     summary: Delete a master maker by id
 *     description: Delete a master maker by id
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
