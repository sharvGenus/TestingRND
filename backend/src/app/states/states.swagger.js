// Swager API doc for /state/create and controller function createState
/**
 * @swagger
 * /state/create:
 *  post:
 *     tags:
 *     - State
 *     summary: Create a new State
 *     description: Create a new State
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              integrationId:
 *                type: string
 *              countryId:
 *                type: string
 *                format: uuid
 *              status:
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

// Swager API doc for /state/update/:id and controller function updateState
/**
 * @swagger
 * /state/update/{id}:
 *  put:
 *     tags:
 *     - State
 *     summary: Update a state by id  
 *     description: Update a state by id
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
 *              code:
 *                type: string
 *              countryId:
 *                type: string
 *                format: uuid
 *              status:
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

// Swager API doc for /state/details/:id and controller function getStateDetails
/**
 * @swagger
 * /state/details/{id}:
 *  get:
 *     tags:
 *     - State
 *     summary: Returns a state by id  
 *     description: Returns a state by id
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

// Swager API doc for /state/list and controller function getAllStates
/**
 * @swagger
 * /state/list:
 *  get:
 *     tags:
 *     - State
 *     summary: Returns all countries  
 *     description: Return all countries
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

// Swager API doc for /state/delete/:id and controller function deleteState
/**
 * @swagger
 * /state/delete/{id}:
 *  delete:
 *     tags:
 *     - State
 *     summary: Delete a state by id  
 *     description: Delete a state by id
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

// Swager API doc for /state/history/:recordId: and controller function getStateHistory
/**
 * @swagger
 * /state/history/:recordId:
 *  get:
 *     tags:
 *     - State
 *     summary: Get a state history by id  
 *     description: Get a state history by id
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