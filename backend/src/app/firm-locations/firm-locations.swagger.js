// Swager API doc for /firm-locations/create and controller function create firm-locations
/**
 * @swagger
 * /firm-locations/create:
 *  post:
 *     tags:
 *     - Firm Location
 *     summary: Create a new firm-locations
 *     description: Create a new firm-locations
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              firmId:
 *                 type: string
 *                 format: uuid
 *              integrationId:
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
 *              address:
 *                 type: string
 *              cityId:
 *                 type: string
 *                 format: uuid
 *              pinCode:
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

// Swager API doc for /firm-locations/update/:id and controller function update firm-locations
/**
 * @swagger
 * /firm-locations/update/{id}:
 *  put:
 *     tags:
 *     - Firm Location
 *     summary: Update a firm-locations by id  
 *     description: Update a firm-locations by id
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
 *              firmId:
 *                 type: string
 *                 format: uuid
 *              integrationId:
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
 *              address:
 *                 type: string
 *              cityId:
 *                 type: string
 *                 format: uuid
 *              pinCode:
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

// Swager API doc for /firm-locations/details/:id and controller function get firm-locationsDetails
/**
 * @swagger
 * /firm-locations/details/{id}:
 *  get:
 *     tags:
 *     - Firm Location
 *     summary: Returns a firm-locations by id  
 *     description: Returns a firm-locations by id
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

// Swager API doc for /firm-locations/list and controller function getAll firm-locations
/**
 * @swagger
 * /firm-locations/list:
 *  get:
 *     tags:
 *     - Firm Location
 *     summary: Returns all firm-locations  
 *     description: Return all firm-locations
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

// Swager API doc for /firm-locations/delete/:id and controller function delete firm-locations
/**
 * @swagger
 * /firm-locations/delete/{id}:
 *  delete:
 *     tags:
 *     - Firm Location
 *     summary: Delete a firm-locations by id  
 *     description: Delete a firm-locations by id
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