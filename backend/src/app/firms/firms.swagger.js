// Swager API doc for /firm/create and controller function createFirm
/**
 * @swagger
 * /firm/create:
 *  post:
 *     tags:
 *     - Firm
 *     summary: Create a new firm
 *     description: Create a new firm
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

// Swager API doc for /firm/update/:id and controller function updateFirm
/**
 * @swagger
 * /firm/update/{id}:
 *  put:
 *     tags:
 *     - Firm
 *     summary: Update a firm by id  
 *     description: Update a firm by id
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
 *              attachments:
 *                 type: string
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

// Swager API doc for /firm/details/:id and controller function getFirmDetails
/**
 * @swagger
 * /firm/details/{id}:
 *  get:
 *     tags:
 *     - Firm
 *     summary: Returns a firm by id  
 *     description: Returns a firm by id
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

// Swager API doc for /firm/list and controller function getAllFirms
/**
 * @swagger
 * /firm/list:
 *  get:
 *     tags:
 *     - Firm
 *     summary: Returns all firms  
 *     description: Return all firms
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

// Swager API doc for /firm/delete/:id and controller function deleteFirm
/**
 * @swagger
 * /firm/delete/{id}:
 *  delete:
 *     tags:
 *     - Firm
 *     summary: Delete a firm by id  
 *     description: Delete a firm by id
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