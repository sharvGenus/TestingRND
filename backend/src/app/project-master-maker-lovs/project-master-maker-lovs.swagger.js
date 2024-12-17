// Swager API doc for /project-master-maker-lov/create and controller function createProjectMasterMakerLov
/**
 * @swagger
 * /project-master-maker-lovs/create:
 *  post:
 *     tags:
 *     - Project Master Maker LOV
 *     summary: Create a new Project Master Maker LOV
 *     description: Create a new Project Master Maker LOV
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
 *              integrationId:
 *                type: string
 *                format: uuid
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              isActive:
 *                 type: integer
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

// Swager API doc for /project-master-maker-lovs/update/:id and controller function updateProjectMasterMakerLov
/**
 * @swagger
 * /project-master-maker-lovs/update/{id}:
 *  put:
 *     tags:
 *     - Project Master Maker LOV
 *     summary: Update a Project Master Maker LOV by id
 *     description: Update a Project Master Maker LOV by id
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
 *              code:
 *                type: string
 *              series:
 *                type: string
 *              isActive:
 *                 type: integer
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

// Swager API doc for /project-master-maker-lovs/details/:id and controller function getProjectMasterMakerLovDetails
/**
 * @swagger
 * /project-master-maker-lovs/details/{id}:
 *  get:
 *     tags:
 *     - Project Master Maker LOV
 *     summary: Returns a Project Master Maker LOV by id
 *     description: Returns a Project Master Maker LOV by id
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

// Swager API doc for /project-master-maker-lovs/list and controller function getAllProjectMasterMakerLov
/**
 * @swagger
 * /project-master-maker-lovs/list:
 *  get:
 *     tags:
 *     - Project Master Maker LOV
 *     summary: Returns all Project Master Maker LOV
 *     description: /project-master-maker-lovs/list?sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
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

// Swager API doc for /project-master-maker-lovs/delete/:id and controller function deleteProjectMasterMakerLov
/**
 * @swagger
 * /project-master-maker-lovs/delete/{id}:
 *  delete:
 *     tags:
 *     - Project Master Maker LOV
 *     summary: Delete a Project Master Maker LOV by id
 *     description: Delete a Project Master Maker LOV by id
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
// Swager API doc for /project-master-maker-lovs/master/:id and controller function get project master maker lov details by Project Id
/**
 * @swagger
 * /project-master-maker-lovs/master/{id}:
 *  get:
 *     tags:
 *     - Project Master Maker LOV
 *     summary: Returns a Project Master Maker LOV by Master Id
 *     description: Returns a Project Master Maker LOV  Name and Id by Master Id
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
