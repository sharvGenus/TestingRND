// Swagger API doc for /role-master-lov-permission/create and controller function CreateRolesMasterLovPermission
/**
 * @swagger
 * /role-master-lov-permission/create:
 *  post:
 *     tags:
 *     - Role Master Lov Permission
 *     summary: Create a new Role Master Lov Permission
 *     description: Create a new Role Master Lov Permission
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              roleId:
 *                type: string
 *                format: uuid
 *              masterId:
 *                type: string
 *                format: uuid
 *              lovId:
 *                type: string
 *                format: uuid
 *              view:
 *                type: boolean
 *              add:
 *                type: boolean
 *              edit:
 *                type: boolean
 *              delete:
 *                type: boolean
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

// Swager API doc for /role-master-lov-permission/update/:id and controller function updateRolesMasterLovPermission
/**
 * @swagger
 * /role-master-lov-permission/update/{id}:
 *  put:
 *     tags:
 *     - Role Master Lov Permission
 *     summary: Update a Role Master Lov Permission by id
 *     description: Update a Role Master Lov Permission by id
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
 *              roleId:
 *                type: string
 *                format: uuid
 *              masterId:
 *                type: string
 *                format: uuid
 *              lovId:
 *                type: string
 *                format: uuid
 *              view:
 *                type: boolean
 *              add:
 *                type: boolean
 *              edit:
 *                type: boolean
 *              delete:
 *                type: boolean
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

// Swager API doc for /role-master-lov-permission/details/:id and controller function getRolesMasterLovPermissionDetails
/**
 * @swagger
 * /role-master-lov-permission/details/{id}:
 *  get:
 *     tags:
 *     - Role Master Lov Permission
 *     summary: Returns a Role Master Lov Permission by id
 *     description: Returns a Role Master Lov Permission by id
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

// Swager API doc for /role-master-lov-permission/list and controller function getAllRoleMasterLovPermission
/**
 * @swagger
 * /role-master-lov-permission/list:
 *  get:
 *     tags:
 *     - Role Master Lov Permission
 *     summary: Returns all role master column permission
 *     description: Return all role master column permission
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

// Swager API doc for /role-master-lov-permission/delete/:id and controller function deleteRolesMasterLovPermission
/**
 * @swagger
 * /role-master-lov-permission/delete/{id}:
 *  delete:
 *     tags:
 *     - Role Master Lov Permission
 *     summary: Delete a Role Master Lov Permission by id
 *     description: Delete a Role Master Lov Permission by id
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

// Swager API doc for /role-master-lov-permission/dropdown/:id and controller function getAllRoleMasterLovByDropdown
/**
 * @swagger
 * /role-master-lov-permission/dropdown/{id}:
 *  get:
 *     tags:
 *     - Role Master Lov Permission
 *     summary: Returns a Role Master Lov Permission by id  
 *     description: Returns a Role Master Lov Permission by id
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