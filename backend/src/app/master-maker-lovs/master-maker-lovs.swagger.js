// Swager API doc for /master-maker-lov/create and controller function createMasterMakerLov
/**
 * @swagger
 * /master-maker-lovs/create:
 *  post:
 *     tags:
 *     - Master Maker LOV
 *     summary: Create a new master maker LOV
 *     description: Create a new master maker LOV
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              masterId:
 *                type: string
 *                format: uuid
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

// Swager API doc for /master-maker-lovs/update/:id and controller function updateMasterMakerLov
/**
 * @swagger
 * /master-maker-lovs/update/{id}:
 *  put:
 *     tags:
 *     - Master Maker LOV
 *     summary: Update a master maker LOV by id
 *     description: Update a master maker LOV by id
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
 *              masterId:
 *                 type: string
 *                 format: uuid
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

// Swager API doc for /master-maker-lovs/details/:id and controller function getMasterMakerLovDetails
/**
 * @swagger
 * /master-maker-lovs/details/{id}:
 *  get:
 *     tags:
 *     - Master Maker LOV
 *     summary: Returns a master maker Lov by id
 *     description: Returns a master maker Lov by id
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

// Swager API doc for /master-maker-lovs/list and controller function getAllMasterMakerLov
/**
 * @swagger
 * /master-maker-lovs/list:
 *  get:
 *     tags:
 *     - Master Maker LOV
 *     summary: Returns all master maker LOV
 *     description: /master-maker-lovs/list?forDropdown=1&masterId=UUID&sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: forDropdown
 *        in: query
 *        schema:
 *          type : string
 *          enum:
 *            - "1"
 *      - name: masterId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
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

// Swager API doc for /master-maker-lovs/delete/:id and controller function deleteMasterMakerLov
/**
 * @swagger
 * /master-maker-lovs/delete/{id}:
 *  delete:
 *     tags:
 *     - Master Maker LOV
 *     summary: Delete a master maker LOV by id
 *     description: Delete a master maker LOV by id
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

// Swager API doc for /lov/list/:masterName and controller function getAllLovByMasterName
/**
 * @swagger
 * /lov/list/{masterName}:
 *  get:
 *     tags:
 *     - Master Maker LOV
 *     summary: Returns all LOV by master name
 *     description: Returns all LOV by master name
 *     parameters:
 *      - name: masterName
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