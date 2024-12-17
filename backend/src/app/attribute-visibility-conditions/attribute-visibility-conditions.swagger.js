// Swager API doc for /attribute-visibility-condition/create and controller function createAttributeVisibilittyConditions
/**
 * @swagger
 * /attribute-visibility-condition/create:
 *  post:
 *     tags:
 *     - Attribute Visibility Condition
 *     summary: Create a new Attribute Visibility Condition
 *     description: Create a new Attribute Visibility Condition
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              visibilityBlockId:
 *                type: string
 *                format: uuid
 *              fromAttributeId:
 *                type: string
 *                format: uuid
 *              operatorKey:
 *                type: string
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

// Swager API doc for /attribute-visibility-condition/update/:id and controller function updateAttributeVisibilityConditions
/**
 * @swagger
 * /attribute-visibility-condition/update/{id}:
 *  put:
 *     tags:
 *     - Attribute Visibility Condition
 *     summary: Update a Attribute Visibility Condition by id  
 *     description: Update a Attribute Visibility Condition by id
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
 *              visibilityBlockId:
 *                type: string
 *                format: uuid
 *              fromAttributeId:
 *                type: string
 *                format: uuid
 *              operatorKey:
 *                type: string
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

// Swager API doc for /attribute-visibility-condition/list and controller function getAllAttributeVisibilityConditions
/**
 * @swagger
 * /attribute-visibility-condition/list:
 *  get:
 *     tags:
 *     - Attribute Visibility Condition
 *     summary: Returns all Attribute Visibility Condition  
 *     description: Return all Attribute Visibility Condition
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

// Swager API doc for /attribute-visibility-condition/delete/:id and controller function deleteAttributeVisibiliytConditions
/**
 * @swagger
 * /attribute-visibility-condition/delete/{id}:
 *  delete:
 *     tags:
 *     - Attribute Visibility Condition
 *     summary: Delete a Attribute Visibility Condition by id  
 *     description: Delete a Attribute Visibility Condition by id
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
// Swager API doc for /attribute-visibility-condition-by-visibilityBLock-id/details/:id and controller function get attribute visibility by block Id
/**
 * @swagger
 * /attribute-visibility-condition-by-visibilityBLock-id/details/{id}:
 *  get:
 *     tags:
 *     - Attribute Visibility Condition
 *     summary: Returns a Attribute Visibility Condition  
 *     description: Returns a Attribute Visibility Condition
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