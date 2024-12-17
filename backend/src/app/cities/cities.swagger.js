// Swager API doc for /city/create and controller function createCountry
/**
 * @swagger
 * /city/create:
 *  post:
 *     tags:
 *     - City
 *     summary: Create a new City
 *     description: Create a new City
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
 *              stateId:
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

// Swager API doc for /city/update/:id and controller function updateCountry
/**
 * @swagger
 * /city/update/{id}:
 *  put:
 *     tags:
 *     - City
 *     summary: Update a city by id
 *     description: Update a city by id
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
 *              stateId:
 *                type: string
 *                format: uuid
 *              integrationId:
 *                type: string
 *              isActive:
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

// Swager API doc for /city/details/:id and controller function getCountryDetails
/**
 * @swagger
 * /city/details/{id}:
 *  get:
 *     tags:
 *     - City
 *     summary: Returns a city by id
 *     description: Returns a city by id
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

// Swager API doc for /city/list and controller function getAllCountries
/**
 * @swagger
 * /city/list:
 *  get:
 *     tags:
 *     - City
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

// Swager API doc for /city/delete/:id and controller function deleteCountry
/**
 * @swagger
 * /city/delete/{id}:
 *  delete:
 *     tags:
 *     - City
 *     summary: Delete a city by id
 *     description: Delete a city by id
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
