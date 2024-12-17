// Swager API doc for /country/create and controller function createCountry
/**
 * @swagger
 * /country/create:
 *  post:
 *     tags:
 *     - Country
 *     summary: Create a new Country
 *     description: Create a new Country
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
 *              isActive:
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

// Swager API doc for /country/update/:id and controller function updateCountry
/**
 * @swagger
 * /country/update/{id}:
 *  put:
 *     tags:
 *     - Country
 *     summary: Update a country by id
 *     description: Update a country by id
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

// Swager API doc for /country/details/:id and controller function getCountryDetails
/**
 * @swagger
 * /country/details/{id}:
 *  get:
 *     tags:
 *     - Country
 *     summary: Returns a country by id
 *     description: Returns a country by id
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

// Swager API doc for /country/list and controller function getAllCountries
/**
 * @swagger
 * /country/list:
 *  get:
 *     tags:
 *     - Country
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

// Swager API doc for /country/delete/:id and controller function deleteCountry
/**
 * @swagger
 * /country/delete/{id}:
 *  delete:
 *     tags:
 *     - Country
 *     summary: Delete a country by id
 *     description: Delete a country by id
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
