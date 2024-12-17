// Swager API doc for /role/create and controller function createRole
/**
 * @swagger
 * /role/create:
 *  post:
 *     tags:
 *     - Role
 *     summary: Create a new Role
 *     description: Create a new Role
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              description:
 *                type: string
 *              projectId:
 *                type: string
 *                format: uuid
 *              isActive:
 *                type: string
 *                enum: [0, 1]
 *                default: 1
 *              remarks:
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

// Swager API doc for /role/update/:id and controller function updateRole
/**
 * @swagger
 * /role/update/{id}:
 *  put:
 *     tags:
 *     - Role
 *     summary: Update a role by id
 *     description: Update a role by id
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
 *              code:
 *                type: string
 *              description:
 *                type: string
 *              projectId:
 *                type: string
 *                format: uuid
 *              isActive:
 *                type: string
 *                enum: [0, 1]
 *                default: 1
 *              remarks:
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

// Swager API doc for /role/details/:id and controller function getRoleDetails
/**
 * @swagger
 * /role/details/{id}:
 *  get:
 *     tags:
 *     - Role
 *     summary: Returns a role by id
 *     description: Returns a role by id
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

// Swager API doc for /role/list and controller function getAllRoles
/**
 * @swagger
 * /role/list:
 *  get:
 *     tags:
 *     - Role
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

// Swager API doc for /role/delete/:id and controller function deleteRole
/**
 * @swagger
 * /role/delete/{id}:
 *  delete:
 *     tags:
 *     - Role
 *     summary: Delete a role by id
 *     description: Delete a role by id
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
// Swager API doc for /gaa-hierarchies/project/:id and controller function get Gaa Hierarchy Name and Id by Project Id
/**
 * @swagger
 * /role/dropdown/{id}:
 *  get:
 *     tags:
 *     - Role
 *     summary: Returns a roles  Name and Id by Project Id
 *     description: Returns a roles  Name and Id by Project Id
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
