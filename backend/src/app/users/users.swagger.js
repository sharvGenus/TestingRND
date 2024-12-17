// Swager API doc for /user/create and controller function createUser
/**
 * @swagger
 * /user/create:
 *  post:
 *     tags:
 *     - User
 *     summary: Create a new user
 *     description: Create a new user
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
 *              oraganizationType:
 *                type: string
 *                format: uuid
 *              oraganizationId:
 *                type: string
 *                format: uuid
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              email:
 *                 type: string
 *              mobileNumber:
 *                 type: string
 *              address:
 *                 type: string
 *              cityId:
 *                 type: string
 *                 format: uuid
 *              pinCode:
 *                 type: string
 *              imeiNumber:
 *                 type: string
 *              imeiNumber2:
 *                 type: string
 *              password:
 *                 type: string
 *              mPin:
 *                 type: string
 *              panNumber:
 *                 type: string
 *              aadharNumber:
 *                 type: string
 *              is2faEnable:
 *                 type: string
 *              dateOfOnboarding:
 *                 type: string
 *              dateOfOffboarding:
 *                 type: string
 *              typeOfOffboarding:
 *                 type: string
 *              reactiveApprovalAttachment:
 *                 type: string
 *              attachments:
 *                 type: string
 *              status:
 *                 type: string
 *                 enum: [0, 1]
 *                 default: 1
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

// Swager API doc for /user/update/:id and controller function updateUser
/**
 * @swagger
 * /user/update/{id}:
 *  put:
 *     tags:
 *     - User
 *     summary: Update a User by id
 *     description: Update a User by id
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
 *              oraganizationType:
 *                type: string
 *                format: uuid
 *              oraganizationId:
 *                type: string
 *                format: uuid
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              email:
 *                 type: string
 *              mobileNumber:
 *                 type: string
 *              address:
 *                 type: string
 *              cityId:
 *                 type: string
 *                 format: uuid
 *              pinCode:
 *                 type: string
 *              imeiNumber:
 *                 type: string
 *              imeiNumber2:
 *                 type: string
 *              password:
 *                 type: string
 *              mPin:
 *                 type: string
 *              panNumber:
 *                 type: string
 *              aadharNumber:
 *                 type: string
 *              is2faEnable:
 *                 type: string
 *              dateOfOnboarding:
 *                 type: string
 *              dateOfOffboarding:
 *                 type: string
 *              typeOfOffboarding:
 *                 type: string
 *              reactiveApprovalAttachment:
 *                 type: string
 *              attachments:
 *                 type: string
 *              status:
 *                 type: string
 *                 enum: [0, 1]
 *                 default: 1
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

// Swager API doc for /user/details/:id and controller function getUserDetails
/**
 * @swagger
 * /user/details/{id}:
 *  get:
 *     tags:
 *     - User
 *     summary: Returns a User by id
 *     description: Returns a User by id
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

// Swager API doc for /user/list and controller function getAllUsers
/**
 * @swagger
 * /user/list:
 *  get:
 *     tags:
 *     - User
 *     summary: Returns all users
 *     description: Return all users
 *     parameters:
 *      - name: roleId
 *        in: query
 *        schema:
 *          type : string
 *      - name: organizationId
 *        in: query
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

// Swager API doc for /user/delete/:id and controller function deleteUser
/**
 * @swagger
 * /user/delete/{id}:
 *  delete:
 *     tags:
 *     - User
 *     summary: Delete a User by id
 *     description: Delete a User by id
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

// Swager API doc for /user/user-exits and controller function checkUserExist
/**
 * @swagger
 * /user/user-exits:
 *  post:
 *     tags:
 *     - User
 *     summary: Check User exits or Not
 *     description: Check User exits or Not
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              value:
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
