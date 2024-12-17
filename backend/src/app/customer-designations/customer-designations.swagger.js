// Swager API doc for /customer-designations/create and controller function createCustomerDesignations
/**
 * @swagger
 * /customer-designations/create:
 *  post:
 *     tags:
 *     - Customer Designation
 *     summary: Create a new customer Designation
 *     description: Create a new customer Designation
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
 *              customerDepartmentId:
 *                type: string
 *                format: uuid
 *              name:
 *                type: string
 *              code:
 *                type: string
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
// Swager API doc for /customer-designations/update/:id and controller function updateCustomerDesignation
/**
 * @swagger
 * /customer-designations/update/{id}:
 *  put:
 *     tags:
 *     - Customer Designation
 *     summary: Update a customer Designation by id  
 *     description: Update a customer Designation by id
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
 *              customerDepartmentId:
 *                type: string
 *                format: uuid
 *              name:
 *                type: string
 *              code:
 *                type: string
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
// Swager API doc for /customer-designations/details/:id and controller function getCustomerDesignation
/**
 * @swagger
 * /customer-designations/details/{id}:
 *  get:
 *     tags:
 *     - Customer Designation
 *     summary: Returns a customer-designations by id  
 *     description: Returns a customer-designations by id
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

// Swager API doc for /customer-designations/list and controller function getAllCustomerDesignation
/**
 * @swagger
 * /customer-designations/list:
 *  get:
 *     tags:
 *     - Customer Designation
 *     summary: Returns all customer-designations 
 *     description: Return all customer-designations 
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

// Swager API doc for /customer-designations/delete/:id and controller function deleteCustomerDesignation
/**
 * @swagger
 * /customer-designations/delete/{id}:
 *  delete:
 *     tags:
 *     - Customer Designation
 *     summary: Delete a customer-designations by id  
 *     description: Delete a customer-designations by id
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