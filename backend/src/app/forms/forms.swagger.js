// Swager API doc for /form/create and controller function createForm
/**
 * @swagger
 * /form/create:
 *  post:
 *     tags:
 *     - Form
 *     summary: Create a new Form
 *     description: Create a new Form. In this in the "attributesArray" key , we need to pass the array of objects in which name, columnName,columnType, mappingColumn, defaultAttributeId, isRequired and json of properties will be passed for the entry of form_attributes table. As many as objects will be passed it will bulkCreate those objects in the table along with formId mapped in it.
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              projectId:
 *                type: string
 *                format: uuid
 *              formTypeId:
 *                type: string
 *                format: uuid
 *              attributesArray:
 *                type: array
 *              active:
 *                type: string
 *                enum: [0, 1]
 *                default: 1
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
 * /form/update/{id}:
 *  put:
 *     tags:
 *     - Form
 *     summary: Update a form by id  
 *     description: Update a form by id
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
 *              integrationId:
 *                type: string
 *              projectId:
 *                type: string
 *                format: uuid
 *              formTypeId:
 *                type: string
 *                format: uuid
 *              active:
 *                type: string
 *                enum: [0, 1]
 *                default: 1
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

// Swager API doc for /form/details/:id and controller function getFormDetails
/**
 * @swagger
 * /form/details/{id}:
 *  get:
 *     tags:
 *     - Form
 *     summary: Returns a form by id  
 *     description: Returns a form by id
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

// Swager API doc for /form/list and controller function getAllForms
/**
 * @swagger
 * /form/list:
 *  get:
 *     tags:
 *     - Form
 *     summary: Returns all forms  
 *     description: Return all forms
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

// Swager API doc for /default-attributes/list and controller function getAllDefaultAttributes
/**
 * @swagger
 * /form/list:
 *  get:
 *     tags:
 *     - Form
 *     summary: Returns all default attributes  
 *     description: Return all default attributes
 *     parameters:
 *      - name: projectId
 *        in: query
 *        schema:
 *          type : string
  *      - name: formTypeId
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

// Swager API doc for /form/delete/:id and controller function deleteForm
/**
 * @swagger
 * /form/delete/{id}:
 *  delete:
 *     tags:
 *     - Form
 *     summary: Delete a form by id  
 *     description: Delete a form by id
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

// Swager API doc for /form/update and controller function updateForm
/**
 * @swagger
 * /form/update:
 *  post:
 *     tags:
 *     - Form
 *     summary: update form
 *     description: update form. In this in the "attributesArray" key , we need to pass the array of objects in which name, columnName,columnType, mappingColumn, defaultAttributeId, isRequired and json of properties will be passed for the entry of form_attributes table. As many as objects will be passed it will bulkCreate those objects in the table along with formId mapped in it. In this if you want to update any existing record in the form attributes then in the object you need to send the id of that particular attribute.
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              formId: 
 *                type: string
 *                format: uuid
 *              integrationId:
 *                type: string
 *              projectId:
 *                type: string
 *                format: uuid
 *              formTypeId:
 *                type: string
 *                format: uuid
 *              attributesArray:
 *                type: array
 *              active:
 *                type: string
 *                enum: [0, 1]
 *                default: 1
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