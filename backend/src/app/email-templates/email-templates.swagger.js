// Swager API doc for /email-template/create and controller function createEmailTemplate
/**
 * @swagger
 * /email-template/create:
 *  post:
 *     tags:
 *     - Email Template
 *     summary: Create a new Email Template
 *     description: Create a new Email Template
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              transactionTypeId:
 *                 type: string
 *                 format: uuid
 *              projectId:
 *                 type: string
 *                 format: uuid
 *              organizationId:
 *                 type: string
 *                 format: uuid
 *              forApprover:
 *                 type: boolean
 *                 default: false
 *              from:
 *                type: string
 *              to:
 *                 type: array
 *                 items:
 *                   type: string
 *              cc:
 *                 type: array
 *                 items:
 *                   type: string
 *              bcc:
 *                 type: array
 *                 items:
 *                   type: string
 *              subject:
 *                type: string
 *              displayName:
 *                type: string
 *              templateName:
 *                 type: string
 *              body:
 *                 type: string
 *              isAttchmentAvailable:
 *                 type: boolean
 *                 default: false
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

// Swager API doc for /email-template/update/:id and controller function updateEmailTemplate
/**
 * @swagger
 * /email-template/update/{id}:
 *  put:
 *     tags:
 *     - Email Template
 *     summary: Update a email-template by id
 *     description: Update a email-template by id
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
 *              transactionTypeId:
 *                 type: string
 *                 format: uuid
 *              projectId:
 *                 type: string
 *                 format: uuid
 *              organizationId:
 *                 type: string
 *                 format: uuid
 *              forApprover:
 *                 type: boolean
 *                 default: false
 *              from:
 *                type: string
 *              to:
 *                 type: array
 *                 items:
 *                   type: string
 *              cc:
 *                 type: array
 *                 items:
 *                   type: string
 *              bcc:
 *                 type: array
 *                 items:
 *                   type: string
 *              subject:
 *                type: string
 *              displayName:
 *                type: string
 *              templateName:
 *                 type: string
 *              body:
 *                 type: string
 *              isAttchmentAvailable:
 *                 type: boolean
 *                 default: false
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

// Swager API doc for /email-template/details/:id and controller function getEmailTemplateDetails
/**
 * @swagger
 * /email-template/details/{id}:
 *  get:
 *     tags:
 *     - Email Template
 *     summary: Returns a email-template by id
 *     description: Returns a email-template by id
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

// Swager API doc for /email-template/list and controller function getAllTemplates
/**
 * @swagger
 * /email-template/list:
 *  get:
 *     tags:
 *     - Email Template
 *     summary: Returns all email-template
 *     description: Return all email-template
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

// Swager API doc for /email-template/delete/:id and controller function deleteEmailTemplate
/**
 * @swagger
 * /email-template/delete/{id}:
 *  delete:
 *     tags:
 *     - Email Template
 *     summary: Delete a email-template by id
 *     description: Delete a email-template by id
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