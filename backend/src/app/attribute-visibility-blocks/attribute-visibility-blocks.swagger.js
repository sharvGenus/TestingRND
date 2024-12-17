// Swager API doc for /attribute-visibility-block/create and controller function createAttributeVisibilityBLocks
/**
 * @swagger
 * /attribute-visibility-block/create:
 *  post:
 *     tags:
 *     - Attribute Visibility Block
 *     summary: Create a new Attribute Visibility Block.  In this in the "conditionsArray" key , we need to pass the array of objects in which operatorKey, compareWithValue, fromAttributeId, isActive and json of properties will be passed for the entry of attribute_visibility_condition table. As many as objects will be passed it will bulkCreate those objects in the table along with formId mapped in it.
 *     description: Create a new Attribute Visibility Block
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              type:
 *                type: string
 *              formId:
 *                type: string 
 *                format: uuid
 *              visibleColumns:
 *                type: array of strings
 *              isPublised:
 *                type: boolean
 *              conditionsArray:
 *                type: array
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

// Swager API doc for /attribute-visibility-block/update/:id and controller function updateAttributeVisibilityBLock
/**
 * @swagger
 * /attribute-visibility-block/update/{id}:
 *  put:
 *     tags:
 *     - Attribute Visibility Block
 *     summary: Update a Attribute Visibility Block by id  
 *     description: Update a Attribute Visibility Block by id
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
 *              type:
 *                type: string
 *              visibleColumns:
 *                type: array of strings
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

// Swager API doc for /attribute-visibility-block/list and controller function getAllAttributeVisibilityBlocks
/**
 * @swagger
 * /attribute-visibility-block/list:
 *  get:
 *     tags:
 *     - Attribute Visibility Block
 *     summary: Returns all Attribute Visibility Block  
 *     description: Return all Attribute Visibility Block
 *     parameters:
 *      - name: formId
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

// Swager API doc for /attribute-visibility-block/delete/:id and controller function deleteAttributeVisibilityBLocks
/**
 * @swagger
 * /attribute-visibility-block/delete/{id}:
 *  delete:
 *     tags:
 *     - Attribute Visibility Block
 *     summary: Delete a Attribute Visibility Block by id  
 *     description: Delete a Attribute Visibility Block by id
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

// Swager API doc for /attribute-visibility-block/update and controller function updateBlockAndConditions
/**
 * @swagger
 * /attribute-visibility-block/create:
 *  post:
 *     tags:
 *     - Attribute Visibility Block
 *     summary: Create a new Attribute Visibility Block.  In this in the "conditionsArray" key , we need to pass the array of objects in which operatorKey, compareWithValue, fromAttributeId. isActive and json of properties will be passed for the entry of attribute_visibility_condition table. As many as objects will be passed it will bulkCreate those objects in the table along with formId mapped in it.
 *     description: Create a new Attribute Visibility Block
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              type:
 *                type: string
 *              formId:
 *                type: string 
 *                format: uuid
 *              visibleColumns:
 *                type: array of strings
 *              isPublised: 
 *                type: boolean
 *              conditionsArray:
 *                type: array
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