// Swagger API doc for /role-master-column-permission/create and controller function createAllMastersList
/**
 * @swagger
 * /role-master-column-permission/create:
 *  post:
 *     tags:
 *     - Role Master Column Permission
 *     summary: Create a new Role Master Column Permission
 *     description: Create a new Role Master Column Permission
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
 *              columnId:
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

// Swager API doc for /role-master-column-permission/update/:id and controller function updateAllMastersList
/**
 * @swagger
 * /role-master-column-permission/update/{id}:
 *  put:
 *     tags:
 *     - Role Master Column Permission
 *     summary: Update a Role Master Column Permission by id
 *     description: Update a Role Master Column Permission by id
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
 *              columnId:
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

// Swager API doc for /role-master-column-permission/details/:id and controller function getAllMastersListDetails
/**
 * @swagger
 * /role-master-column-permission/details/{id}:
 *  get:
 *     tags:
 *     - Role Master Column Permission
 *     summary: Returns a Role Master Column Permission by id
 *     description: Returns a Role Master Column Permission by id
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

// Swager API doc for /role-master-column-permission/list and controller function getAllRoleMasterColumnPermission
/**
 * @swagger
 * /role-master-column-permission/list:
 *  get:
 *     tags:
 *     - Role Master Column Permission
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

// Swager API doc for /role-master-column-permission/delete/:id and controller function deleteAllMastersList
/**
 * @swagger
 * /role-master-column-permission/delete/{id}:
 *  delete:
 *     tags:
 *     - Role Master Column Permission
 *     summary: Delete a Role Master Column Permission by id
 *     description: Delete a Role Master Column Permission by id
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

// Swager API doc for /role-master-column-permission/dropdown/:id and controller function getAllNetworkLevelEntryByDropdown
/**
 * @swagger
 * /role-master-column-permission/dropdown/{id}:
 *  get:
 *     tags:
 *     - Role Master Column Permission
 *     summary: Returns a Role Master Column Permission by id  
 *     description: Returns a Role Master Column Permission by id
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