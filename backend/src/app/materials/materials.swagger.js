// Swager API doc for /material/create and controller function createMaterial
/**
 * @swagger
 * /material/create:
 *  post:
 *     tags:
 *     - Material
 *     summary: Create a new material
 *     description: Create a new material
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              integrationId:
 *                type: string
 *              materialTypeId:
 *                 type: string
 *                 format: uuid
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              description:
 *                 type: string
 *              longDescription:
 *                 type: string
 *              uomId:
 *                 type: string
 *                 format: uuid
 *              hsnCode:
 *                 type: string
 *              attachments:
 *                 type: string
 *              isSerialNumber:
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

// Swager API doc for /material/update/:id and controller function updateMaterial
/**
 * @swagger
 * /material/update/{id}:
 *  put:
 *     tags:
 *     - Material
 *     summary: Update a material by id
 *     description: Update a materail by id
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
 *              materialTypeId:
 *                 type: string
 *                 format: uuid
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              descriptiom:
 *                 type: string
 *              longDescription:
 *                 type: string
 *              uomId:
 *                 type: string
 *                 format: uuid
 *              hsnCode:
 *                 type: string
 *              attachments:
 *                 type: string
 *              isSerialNumber:
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

// Swager API doc for /material/details/:id and controller function getMaterialDetails
/**
 * @swagger
 * /material/details/{id}:
 *  get:
 *     tags:
 *     - Material
 *     summary: Returns a material by id
 *     description: Returns a material by id
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

// Swager API doc for /material/list and controller function getAllMaterial
/**
 * @swagger
 * /material/list:
 *  get:
 *     tags:
 *     - Material
 *     summary: Returns all material
 *     description: Return all material
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

// Swager API doc for /material/delete/:id and controller function deleteMaterial
/**
 * @swagger
 * /material/delete/{id}:
 *  delete:
 *     tags:
 *     - Material
 *     summary: Delete a material by id
 *     description: Delete a material by id
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

// Swager API doc for /material-details/:integrationId and controller function getMaterialDetailsByIntegrationId
/**
 * @swagger
 * /material-details/{integrationId}:
 *  get:
 *     tags:
 *     - Material
 *     summary: Returns material details by integration id
 *     description: Returns material details by integration id
 *     parameters:
 *      - name: integrationId 
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