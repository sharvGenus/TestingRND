// Swager API doc for /location-site-stores/create and controller function create location-site-stores
/**
 * @swagger
 * /location-site-stores/create:
 *  post:
 *     tags:
 *     - Location Site Store
 *     summary: Create a new location-site-stores
 *     description: Create a new location-site-stores
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              projectSiteStoreId:
 *                 type: string
 *                 format: uuid
 *              integrationId:
 *                type: string
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              address:
 *                 type: string
 *              cityId:
 *                 type: string
 *                 format: uuid
 *              pinCode:
 *                 type: string
 *              remarks:
 *                 type: string
 *              
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

// Swager API doc for /location-site-stores/update/:id and controller function update location-site-stores
/**
 * @swagger
 * /location-site-stores/update/{id}:
 *  put:
 *     tags:
 *     - Location Site Store
 *     summary: Update a location-site-stores by id  
 *     description: Update a location-site-stores by id
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
 *              projectSiteStoreId:
 *                 type: string
 *                 format: uuid
 *              integrationId:
 *                type: string
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              address:
 *                 type: string
 *              cityId:
 *                 type: string
 *                 format: uuid
 *              pinCode:
 *                 type: string
 *              remarks:
 *                 type: string
 *  responses:
 *      200:
 *        description: Updated
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Internal Error
 */

// Swager API doc for /location-site-stores/details/:id and controller function get location-site-storesDetails
/**
 * @swagger
 * /location-site-stores/details/{id}:
 *  get:
 *     tags:
 *     - Location Site Store
 *     summary: Returns a location-site-stores by id  
 *     description: Returns a location-site-stores by id
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

// Swager API doc for /location-site-stores/list and controller function getAll location-site-stores
/**
 * @swagger
 * /location-site-stores/list:
 *  get:
 *     tags:
 *     - Location Site Store
 *     summary: Returns all location-site-stores  
 *     description: Return all location-site-stores
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

// Swager API doc for /location-site-stores/delete/:id and controller function delete location-site-stores
/**
 * @swagger
 * /location-site-stores/delete/{id}:
 *  delete:
 *     tags:
 *     - Location Site Store
 *     summary: Delete a location-site-stores by id  
 *     description: Delete a location-site-stores by id
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