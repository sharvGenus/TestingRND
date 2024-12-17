// Swager API doc for /smtp-configuration/create and controller function createSmtpConfiguration
/**
 * @swagger
 * /smtp-configuration/create:
 *  post:
 *     tags:
 *     - SMTP Configuration
 *     summary: Create a new SMTP Configuration
 *     description: Create a new SMTP Configuration
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              server:
 *                type: string
 *              port:
 *                type: integer
 *                default: 587
 *              encryption:
 *                type: string
 *              username:
 *                type: string
 *                format: email
 *              password:
 *                type: string
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

// Swager API doc for /smtp-configuration/update/:id and controller function updateSmtpConfiguration
/**
 * @swagger
 * /smtp-configuration/update/{id}:
 *  put:
 *     tags:
 *     - SMTP Configuration
 *     summary: Update a SMTP Configuration by id
 *     description: Update a SMTP Configuration by id
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type : string
 *          format: uuid
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              server:
 *                type: string
 *              port:
 *                type: integer
 *                default: 587
 *              encryption:
 *                type: string
 *              username:
 *                type: string
 *                format: email
 *              password:
 *                type: string
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

// Swager API doc for /smtp-configuration/list and controller function getSmtpConfigurationList
/**
 * @swagger
 * /smtp-configuration/list:
 *  get:
 *     tags:
 *     - SMTP Configuration
 *     summary: Returns SMTP configuration list 
 *     description: Return SMTP configuration list
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

// Swager API doc for /smtp-configuration/delete/:id and controller function deleteSmtpConfiguration
/**
 * @swagger
 * /smtp-configuration/delete/{id}:
 *  delete:
 *     tags:
 *     - SMTP Configuration
 *     summary: Delete a SMTP Configuration by id
 *     description: Delete a SMTP Configuration by id
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type : string
 *          format: uuid
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