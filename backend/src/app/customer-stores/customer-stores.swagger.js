// Swager API doc for /Customer-store/create and controller function create Customer-store
/**
 * @swagger
 * /customer-stores/create:
 *  post:
 *     tags:
 *     - Customer Store
 *     summary: Create a new customer-store
 *     description: Create a new customer-store
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              projectId:
 *                 type: string
 *                 format: uuid
 *              integrationId:
 *                type: string
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              photo:
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
 *              registeredOfficePinCode:
 *                 type: string
 *              currentOfficeAddress:
 *                 type: string
 *              currentOfficeCityId:
 *                 type: string
 *                 format: uuid
 *              currentOfficePinCode:
 *                 type: string
 *              attachments:
 *                 type: string
 *              remarks:
 *                 type: string
 *              
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

// Swager API doc for /customer-stores/update/:id and controller function update Customer-store
/**
 * @swagger
 * /customer-stores/update/{id}:
 *  put:
 *     tags:
 *     - Customer Store
 *     summary: Update a customer-store by id  
 *     description: Update a customer-store by id
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
 *              projectId:
 *                 type: string
 *                 format: uuid
 *              integrationId:
 *                type: string
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              photo:
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
 *              registeredOfficePinCode:
 *                 type: string
 *              currentOfficeAddress:
 *                 type: string
 *              currentOfficeCityId:
 *                 type: string
 *                 format: uuid
 *              currentOfficePinCode:
 *                 type: string
 *              attachments:
 *                 type: string
 *              remarks:
 *                 type: string   
 *  responses:
 *      200:
 *        description: Updated
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Internal Error
 */

// Swager API doc for /customer-stores/details/:id and controller function get Customer-storeDetails
/**
 * @swagger
 * /customer-stores/details/{id}:
 *  get:
 *     tags:
 *     - Customer Store
 *     summary: Returns a customer-store by id  
 *     description: Returns a customer-store by id
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

// Swager API doc for /customer-stores/list and controller function getAll Customer-stores
/**
 * @swagger
 * /customer-stores/list:
 *  get:
 *     tags:
 *     - Customer Store
 *     summary: Returns all customer-stores  
 *     description: Return all customer-stores
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

// Swager API doc for /customer-stores/delete/:id and controller function delete Customer-store
/**
 * @swagger
 * /customer-stores/delete/{id}:
 *  delete:
 *     tags:
 *     - Customer Store
 *     summary: Delete a customer-store by id  
 *     description: Delete a customer-store by id
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