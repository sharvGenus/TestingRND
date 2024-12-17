// Swager API doc for /customer-departments/create and controller function createCustomerDepartments
/**
 * @swagger
 * /customer-departments/create:
 *  post:
 *     tags:
 *     - Customer Department
 *     summary: Create a new customer department
 *     description: Create a new customer department
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              customerId:
 *                type: string
 *                format: uuid
 *              integrationId:
 *                type: string
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              attachments:
 *                 type: string
 *              isActive:
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
// Swager API doc for /customer-departments/update/:id and controller function updateCustomer
/**
 * @swagger
 * /customer-departments/update/{id}:
 *  put:
 *     tags:
 *     - Customer Department
 *     summary: Update a customer department by id
 *     description: Update a customer department by id
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
 *              customerId:
 *                type: string
 *                format: uuid
 *              integrationId:
 *                type: string
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              attachments:
 *                 type: string
 *              isActive:
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
// Swager API doc for /customer-departments/details/:id and controller function getCustomerDepartment
/**
 * @swagger
 * /customer-departments/details/{id}:
 *  get:
 *     tags:
 *     - Customer Department
 *     summary: Returns a customer-departments by id
 *     description: Returns a customer-departments by id
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

// Swager API doc for /customer-departments/list and controller function getAllCustomerDepartment
/**
 * @swagger
 * /customer-departments/list:
 *  get:
 *     tags:
 *     - Customer Department
 *     summary: Returns all customer-departments
 *     description: Return all customer-departments
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

// Swager API doc for /customer-departments/delete/:id and controller function deleteCustomerDepartment
/**
 * @swagger
 * /customer-departments/delete/{id}:
 *  delete:
 *     tags:
 *     - Customer Department
 *     summary: Delete a customer-departments by id
 *     description: Delete a customer-departments by id
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
// Swager API doc for /customer-departments/dropdown and controller function getAllCustomerDepartmentByDropdown
/**
 * @swagger
 * /customer-departments/dropdown/{customerId}:
 *  get:
 *     tags:
 *     - Customer Department
 *     summary: get all customer department name and id
 *     description: get all customer department name and id
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
