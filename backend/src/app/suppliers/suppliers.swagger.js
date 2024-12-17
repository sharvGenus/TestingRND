// Swager API doc for /Suppliers/create and controller function create Suppliers
/**
 * @swagger
 * /suppliers/create:
 *  post:
 *     tags:
 *     - Supplier
 *     summary: Create a new suppliers
 *     description: Create a new suppliers
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              integrationId:
 *                type: string
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              type:
 *                type: string
 *                enum: ["Genus", "Vendor", "Customer"]
 *                default: "Genus"
 *              website:
 *                type: string
 *              gstNumber:
 *                 type: string
 *              email:
 *                 type: string
 *              mobileNumber:
 *                 type: string
 *              telephone:
 *                 type: string
 *              address:
 *                 type: string
 *              aadharNumber:
 *                 type: string
 *              panNumber:
 *                 type: string
 *              cityId:
 *                 type: string
 *                 format: uuid
 *              pinCode:
 *                 type: string
 *              attachments:
 *                 type: string
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

// Swager API doc for /suppliers/update/:id and controller function update Suppliers
/**
 * @swagger
 * /suppliers/update/{id}:
 *  put:
 *     tags:
 *     - Supplier
 *     summary: Update a suppliers by id  
 *     description: Update a suppliers by id
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
 *              integrationId:
 *                type: string
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              type:
 *                type: string
 *                enum: ["Genus", "Vendor", "Customer"]
 *                default: "Genus"
 *              website:
 *                type: string
 *              gstNumber:
 *                 type: string
 *              email:
 *                 type: string
 *              mobileNumber:
 *                 type: string
 *              telephone:
 *                 type: string
 *              address:
 *                 type: string
 *              aadharNumber:
 *                 type: string
 *              panNumber:
 *                 type: string
 *              cityId:
 *                 type: string
 *                 format: uuid
 *              pinCode:
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

// Swager API doc for /suppliers/details/:id and controller function get SuppliersDetails
/**
 * @swagger
 * /suppliers/details/{id}:
 *  get:
 *     tags:
 *     - Supplier
 *     summary: Returns a suppliers by id  
 *     description: Returns a suppliers by id
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

// Swager API doc for /suppliers/list and controller function getAll Suppliers
/**
 * @swagger
 * /suppliers/list:
 *  get:
 *     tags:
 *     - Supplier
 *     summary: Returns all suppliers  
 *     description: Return all suppliers
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

// Swager API doc for /suppliers/delete/:id and controller function delete Suppliers
/**
 * @swagger
 * /suppliers/delete/{id}:
 *  delete:
 *     tags:
 *     - Supplier
 *     summary: Delete a suppliers by id  
 *     description: Delete a suppliers by id
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