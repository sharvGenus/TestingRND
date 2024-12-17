// Swager API doc for /customer/create and controller function createCustomer
/**
 * @swagger
 * /customer/create:
 *  post:
 *     tags:
 *     - Customer
 *     summary: Create a new customer
 *     description: Create a new customer
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
 *              gstNumber:
 *                 type: string
 *              email:
 *                 type: string
 *              mobileNumber:
 *                 type: string
 *              telephone:
 *                 type: string
 *              registeredOfficeAddress:
 *                 type: string
 *              registeredOfficeCityId:
 *                 type: string
 *                 format: uuid
 *              registeredOfficePincode:
 *                 type: string
 *              currentOfficeAddress:
 *                 type: string
 *              currentOfficeCityId:
 *                 type: string
 *                 format: uuid
 *              currentOfficePincode:
 *                 type: string
 *              attachments:
 *                 type: string
 *              isActive:
 *                type: string
 *                enum: [0, 1]
 *                default: 1
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
// Swager API doc for /customer/update/:id and controller function updateCustomer
/**
 * @swagger
 * /customer/update/{id}:
 *  put:
 *     tags:
 *     - Customer
 *     summary: Update a customer by id
 *     description: Update a customer by id
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
 *              gstNumber:
 *                 type: string
 *              email:
 *                 type: string
 *              mobileNumber:
 *                 type: string
 *              telephone:
 *                 type: string
 *              registeredOfficeAddress:
 *                 type: string
 *              registeredOfficeCityId:
 *                 type: string
 *                 format: uuid
 *              registeredOfficePincode:
 *                 type: string
 *              currentOfficeAddress:
 *                 type: string
 *              currentOfficeCityId:
 *                 type: string
 *                 format: uuid
 *              currentOfficePincode:
 *                  type: string
 *              attachments:
 *                 type: string
 *              isActive:
 *                type: string
 *                enum: [0, 1]
 *                default: 1
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
// Swager API doc for /customer/details/:id and controller function getCustomerDetails
/**
 * @swagger
 * /Customer/details/{id}:
 *  get:
 *     tags:
 *     - Customer
 *     summary: Returns a customer by id
 *     description: Returns a customer by id
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
// Swager API doc for /customer/list and controller function getAllCustomers
/**
 * @swagger
 * /customer/list:
 *  get:
 *     tags:
 *     - Customer
 *     summary: Returns all customer
 *     description: Return all customer
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
// Swager API doc for /customer/delete/:id and controller function deleteCustomer
/**
 * @swagger
 * /customer/delete/{id}:
 *  delete:
 *     tags:
 *     - Customer
 *     summary: Delete a customer by id
 *     description: Delete a customer by id
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
