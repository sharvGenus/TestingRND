// Swager API doc for /qa-master-maker-lov/create and controller function createQaMasterMakerLov
/**
 * @swagger
 * /qa-master-maker-lov/create:
 *  post:
 *     tags:
 *     - QA Master Maker Lov
 *     summary: Create qa master maker lov
 *     description: Create qa master maker lov
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
 *              majorContributor:
 *                type: string
 *              code:
 *                type: string
 *              priority:
 *                type: integer
 *                minimum: 0
 *              defect:
 *                type: string 
 *              observationTypeId:
 *                 type: string
 *                 format: uuid
 *              observationSeverityId:
 *                 type: string
 *                 format: uuid
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

// Swager API doc for /qa-master-maker-lov/list and controller function getQaMasterMakerLovList
/**
 * @swagger
 * /qa-master-maker-lov/list:
 *  get:
 *     tags:
 *     - QA Master Maker Lov
 *     summary: Returns qa master maker lov list
 *     description: /qa-master-maker-lov/list?masterId=UUID&sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
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

// Swager API doc for /qa-master-maker-lov/update/:id and controller function updateQaMasterMakerLov
/**
 * @swagger
 * /qa-master-maker-lov/update/{id}:
 *  put:
 *     tags:
 *     - QA Master Maker Lov
 *     summary: Update qa master maker lov by id
 *     description: Update qa master maker lov by id
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
 *              majorContributor:
 *                type: string
 *              code:
 *                type: string
 *              priority:
 *                type: integer
 *                minimum: 0
 *              defect:
 *                type: string 
 *              observationTypeId:
 *                 type: string
 *                 format: uuid
 *              observationSeverityId:
 *                 type: string
 *                 format: uuid
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

// Swager API doc for /qa-master-maker-lov/delete/:id and controller function deleteQaMasterMakerLov
/**
 * @swagger
 * /qa-master-maker-lov/delete/{id}:
 *  delete:
 *     tags:
 *     - QA Master Maker Lov
 *     summary: Delete qa master maker lov by id
 *     description: Delete qa master maker lov by id
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

// Swager API doc for /qa-master-maker-lov/history/:recordId and controller function getQaMasterMakerLovHistory
/**
 * @swagger
 * /qa-master-maker-lov/history/{recordId}:
 *  get:
 *     tags:
 *     - QA Master Maker Lov
 *     summary: Get qa master maker lov history by recordId
 *     description: /qa-master-maker-lov/history/{recordId}?sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
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