// Swager API doc for /user-master-permission/create and controller function createUserMasterPermission
/**
 * @swagger
 * /user-master-permission/create:
 *  post:
 *     tags:
 *     - User Master Permission
 *     summary: Create a new User Master Permission
 *     description: Create a new User Master Permission
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: string
 *                format: uuid
 *              masterId:
 *                type: string
 *                format: uuid
 *              view: 
 *                type: boolean
 *              edit:
 *                type: boolean
 *              add: 
 *                type: boolean
 *              delete:         
 *                type:boolean
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

// Swager API doc for /user-master-permission/update/:id and controller function updateUserMasterPermission
/**
 * @swagger
 * /user-master-permission/update/{id}:
 *  put:
 *     tags:
 *     - User Master Permission
 *     summary: Update a User Master Permission by id  
 *     description: Update a User Master Permission by id
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
 *              userId:
 *                type: string
 *                format: uuid
 *              masterId:
 *                type: string
 *                format: uuid
 *              view: 
 *                type: boolean
 *              edit:
 *                type: boolean
 *              add: 
 *                type: boolean
 *              delete:         
 *                type:boolean
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

// Swager API doc for /user-master-permission-by-userId/details/:id and controller function getUserMasterPermissionByUserId
/**
 * @swagger
 * /user-master-permission-by-userId/details/{id}:
 *  get:
 *     tags:
 *     - User Master Permission
 *     summary: Returns a User Master Permission by user's id  
 *     description: Returns a User Master Permission by user's id
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

// Swager API doc for /user-master-permission/delete/:id and controller function deleteUserMasterPermission
/**
 * @swagger
 * /user-master-permission/delete/id}:
 *  delete:
 *     tags:
 *     - User Master Permission
 *     summary: Force Delete a User Master Permission by id  
 *     description: Force Delete a Work Area Assignment by id
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