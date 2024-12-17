// Swager API doc for /user-master-lov-permission/create and controller function createUserMasterColumnPermission
/**
 * @swagger
 * /user-master-lov-permission/create:
 *  post:
 *     tags:
 *     - User Master Lov Permission
 *     summary: Create a new User Master Lov Permission
 *     description: Create a new User Master Lov Permission
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
 *              roleId:
 *                type: string
 *                format: uuid
 *              userId:
 *                type: string
 *                format: uuid
 *              lovId:
 *                type: string
 *                format: uuid
 *              columnId:
 *                type: string
 *                format: uuid
 *              view:
 *                type: boolean
 *              edit:
 *                type: boolean
 *              add:
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

// Swager API doc for /user-master-lov-permission/update/:id and controller function updateUserMasterColumnPermission
/**
 * @swagger
 * /user-master-lov-permission/update/{id}:
 *  put:
 *     tags:
 *     - User Master Lov Permission
 *     summary: Update a User Master Lov Permission by id
 *     description: Update a User Master Lov Permission by id
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
 *                type: string
 *                format: uuid
 *              roleId:
 *                type: string
 *                format: uuid
 *              userId:
 *                type: string
 *                format: uuid
 *              lovId:
 *                type: string
 *                format: uuid
 *              columnId:
 *                type: string
 *                format: uuid
 *              view:
 *                type: boolean
 *              edit:
 *                type: boolean
 *              add:
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

// Swager API doc for /user-master-lov-permission-by-userId/details/:id  and controller function getUserMasterColumnPermission
/**
 * @swagger
 * /user-master-lov-permission-by-userId/details/{id}:
 *  get:
 *     tags:
 *     - User Master Lov Permission
 *     summary: Returns a User Master Lov Permission by id
 *     description: Returns a User Master Lov Permission by id
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

// Swager API doc for /user-master-lov-permission/getDetails and controller function getUserMasterColumnPermission
/**
 * @swagger
 * /user-master-lov-permission/getDetails:
 *  get:
 *     tags:
 *     - User Master Lov Permission
 *     summary: Returns all User Master Lov Permission
 *     description: Return all User Master Lov Permission
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

// Swager API doc for /user-master-lov-permission/delete/:id and controller function deleteAllMastersList
/**
 * @swagger
 * /user-master-lov-permission/delete/{id}:
 *  delete:
 *     tags:
 *     - User Master Lov Permission
 *     summary: Delete a User Master Lov Permission by id
 *     description: Delete a User Master Lov Permission by id
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
