// Swager API doc for /project-master-maker/create and controller function createProjectMasterMaker
/**
 * @swagger
 * /project-master-maker/create:
 *  post:
 *     tags:
 *     - Project Master Maker
 *     summary: Create a new project master maker
 *     description: Create a new project master maker
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              projectId:
 *                 type: string
 *                 format: uuid
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

// Swager API doc for /project-master-maker/update/:id and controller function updateProjectMasterMaker
/**
 * @swagger
 * /project-master-maker/update/{id}:
 *  put:
 *     tags:
 *     - Project Master Maker
 *     summary: Update a project master maker by id
 *     description: Update a project master maker by id
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

// Swager API doc for /project-master-maker/details/:id and controller function getProjectMasterMakerDetails
/**
 * @swagger
 * /project-master-maker/details/{id}:
 *  get:
 *     tags:
 *     - Project Master Maker
 *     summary: Returns a project master maker by id
 *     description: Returns a project master maker by id
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

// Swager API doc for /project-master-maker/list and controller function getAllProjectMasterMaker
/**
 * @swagger
 * /project-master-maker/list:
 *  get:
 *     tags:
 *     - Project Master Maker
 *     summary: Returns all project master maker
 *     description: /project-master-maker/list?sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
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

// Swager API doc for /project-master-maker/delete/:id and controller function deleteProjectMasterMaker
/**
 * @swagger
 * /project-master-maker/delete/{id}:
 *  delete:
 *     tags:
 *     - Project Master Maker
 *     summary: Delete a project master maker by id
 *     description: Delete a project master maker by id
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
