// Swager API doc for /attribute-validation-condition/create and controller function createAttributeValidationConditions
/**
 * @swagger
 * /attribute-validation-condition/create:
 *  post:
 *     tags:
 *     - Attribute Validation Condition
 *     summary: Create a new Attribute Validation Condition
 *     description: Create a new Attribute Validation Condition
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              validationBlockId:
 *                type: string
 *                format: uuid
 *              fromAttributeId:
 *                type: string
 *                format: uuid
 *              operatorKey:
 *                type: string 
 *              compareWithFormAttributeId:
 *                type: string
 *                format: uuid
 *              compareWithValue:
 *                type: string
 *              active:
 *                type: string
 *                enum: [0, 1]
 *                default: 1
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

// Swager API doc for /attribute-validation-condition/update/:id and controller function updateAttributeValidationConditions
/**
 * @swagger
 * /attribute-validation-condition/update/{id}:
 *  put:
 *     tags:
 *     - Attribute Validation Condition
 *     summary: Update a Attribute Validation Condition by id  
 *     description: Update a Attribute Validation Condition by id
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
 *              validationBlockId:
 *                type: string
 *                format: uuid
 *              fromAttributeId:
 *                type: string
 *                format: uuid
 *              operatorKey:
 *                type: string 
 *              compareWithFormAttributeId:
 *                type: string
 *                format: uuid
 *              compareWithValue:
 *                type: string
 *              active:
 *                type: string
 *                enum: [0, 1]
 *                default: 1
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

// Swager API doc for /attribute-validation-condition/list and controller function getAllAttributeValidationConditions
/**
 * @swagger
 * /attribute-validation-condition/list:
 *  get:
 *     tags:
 *     - Attribute Validation Condition
 *     summary: Returns all Attribute Validation Condition  
 *     description: Return all Attribute Validation Condition
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

// Swager API doc for /attribute-validation-condition/delete/:id and controller function deleteAttributeValidationConditions
/**
 * @swagger
 * /attribute-validation-condition/delete/{id}:
 *  delete:
 *     tags:
 *     - Attribute Validation Condition
 *     summary: Delete a Attribute Validation Condition by id  
 *     description: Delete a Attribute Validation Condition by id
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
// Swager API doc for /attribute-validation-condition-by-validtionBLock-id/details/:id and controller function get attribute Validation by block Id
/**
 * @swagger
 * /attribute-validation-condition-by-validtionBLock-id/details/{id}:
 *  get:
 *     tags:
 *     - Attribute Validation Condition
 *     summary: Returns a Attribute Validation Condition  
 *     description: Returns a Attribute Validation Condition
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
