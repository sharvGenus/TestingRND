// Swager API doc for /form-attributes/create and controller function createFormAttribute
/**
 * @swagger
 * /form-attributes/create:
 *  post:
 *     tags:
 *     - Form Attributes
 *     summary: Create a new Form Attribute
 *     description: Create a new Form Attribute
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              rank:
 *                type: string
 *              screenType:
 *                type: string
 *              formTypeId:
 *                type: string
 *                format: uuid
 *              defaultAttributeId:
 *                type: string
 *                format: uuid
 *              properties:
 *                type: string
 *                format: json
 *              active:
 *                type: string
 *                enum: [0, 1]
 *                default: 1
 *              isRequired:
 *                type: boolean
 *              isNull:
 *                type: boolean
 *              isUnique:
 *                type: boolean
 *              remarks:
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

// Swager API doc for /form/update/:id and controller function updateForm
/**
 * @swagger
 * /form-attributes/update/{id}:
 *  put:
 *     tags:
 *     - Form Attributes
 *     summary: Update a form Attribute by id  
 *     description: Update a form Attribute by id
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
 *              rank:
 *                type: string
 *              screenType:
 *                type: string
 *              formTypeId:
 *                type: string
 *                format: uuid
 *              defaultAttributeId:
 *                type: string
 *                format: uuid
 *              properties:
 *                type: string
 *                format: json
 *              active:
 *                type: string
 *                enum: [0, 1]
 *                default: 1
 *              isRequired:
 *                type: boolean
 *              isNull:
 *                type: boolean
 *              isUnique:
 *                type: boolean
 *              remarks:
 *                type: string
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

// Swager API doc for /formAttribute/details/:id and controller function getFormAttributeDetails
/**
 * @swagger
 * /form-attributes/details/{id}:
 *  get:
 *     tags:
 *     - Form Attributes
 *     summary: Returns a Form Attributes by id  
 *     description: Returns a Form Attributes by id
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

// Swager API doc for /Form Attributes/list and controller function getAllFormAttributes
/**
 * @swagger
 * /form-attributes/list:
 *  get:
 *     tags:
 *     - Form Attributes
 *     summary: Returns all forms  
 *     description: Return all forms
 *     parameters:
 *      - name: formID
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

// Swager API doc for /form-attributes/list/delete/:id and controller function deleteFormAttribute
/**
 * @swagger
 * /form-attributes/delete/{id}:
 *  delete:
 *     tags:
 *     - Form Attributes
 *     summary: Delete a Form Attributes by id  
 *     description: Delete a Form Attributes by id
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