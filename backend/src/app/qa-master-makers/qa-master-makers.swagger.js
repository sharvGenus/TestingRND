// Swager API doc for /qa-master-maker/create and controller function createQaMasterMaker
/**
 * @swagger
 * /qa-master-maker/create:
 *  post:
 *     tags:
 *     - QA Master Maker
 *     summary: Create qa master maker
 *     description: Create qa master maker
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              projectId:
 *                 type: string
 *                 format: uuid
 *              meterTypeId:
 *                 type: string
 *                 format: uuid
 *              name:
 *                type: string
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

// Swager API doc for /qa-master-maker/list and controller function getQaMasterMakerList
/**
 * @swagger
 * /qa-master-maker/list:
 *  get:
 *     tags:
 *     - QA Master Maker
 *     summary: Returns qa master maker list
 *     description: /qa-master-maker/list?projectId=UUID&meterTypetId=UUID&sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: projectId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: meterTypetId
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

// Swager API doc for /qa-master-maker/update/:id and controller function updateQaMasterMaker
/**
 * @swagger
 * /qa-master-maker/update/{id}:
 *  put:
 *     tags:
 *     - QA Master Maker
 *     summary: Update qa master maker by id
 *     description: Update qa master maker by id
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
 *              projectId:
 *                 type: string
 *                 format: uuid
 *              meterTypeId:
 *                 type: string
 *                 format: uuid
 *              name:
 *                type: string
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

// Swager API doc for /qa-master-maker/delete/:id and controller function deleteQaMasterMaker
/**
 * @swagger
 * /qa-master-maker/delete/{id}:
 *  delete:
 *     tags:
 *     - QA Master Maker
 *     summary: Delete qa master maker by id
 *     description: Delete qa master maker by id
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

// Swager API doc for /qa-master-maker/history/:recordId and controller function getQaMasterMakerHistory
/**
 * @swagger
 * /qa-master-maker/history/{recordId}:
 *  get:
 *     tags:
 *     - QA Master Maker
 *     summary: Get qa master maker history by recordId
 *     description: /qa-master-maker/history/{recordId}?sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: recordId
 *        in: path
 *        required: true
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