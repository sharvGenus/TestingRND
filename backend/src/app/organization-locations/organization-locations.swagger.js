// Swager API doc for /organization-locations/create and controller function create organization-locations
/**
 * @swagger
 * /organization-locations/create:
 *  post:
 *     tags:
 *     - Organization Location
 *     summary: Create a new organization-locations
 *     description: Create a new organization-locations
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              organizationTypeId:
 *                 type: string
 *                 format: uuid
 *              organizationId:
 *                 type: string
 *                 format: uuid
 *              integrationId:
 *                type: string
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              gstNumber:
 *                 type: string
 *              email:
 *                 type: string
 *              mobileNumber:
 *                 type: string
 *              telephone:
 *                 type: string
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

// Swager API doc for /organization-locations/update/:id and controller function update organization-locations
/**
 * @swagger
 * /organization-locations/update/{id}:
 *  put:
 *     tags:
 *     - Organization Location
 *     summary: Update a organization-locations by id  
 *     description: Update a organization-locations by id
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
 *              organizationId:
 *                 type: string
 *                 format: uuid
 *              integrationId:
 *                type: string
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              gstNumber:
 *                 type: string
 *              email:
 *                 type: string
 *              mobileNumber:
 *                 type: string
 *              telephone:
 *                 type: string
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

// Swager API doc for /organization-locations/details/:id and controller function get organization-locationsDetails
/**
 * @swagger
 * /organization-locations/details/{id}:
 *  get:
 *     tags:
 *     - Organization Location
 *     summary: Returns a organization-locations by id  
 *     description: Returns a organization-locations by id
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

// Swager API doc for /organization-locations/list and controller function getAll organization-locations
/**
 * @swagger
 * /organization-locations/list/{organizationTypeId}:
 *  get:
 *     tags:
 *     - Organization Location
 *     summary: Returns all organization-locations by organizationTypeId  
 *     description: Return all organization-locations by organizationTypeId
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

// Swager API doc for /organization-locations/delete/:id and controller function delete organization-locations
/**
 * @swagger
 * /organization-locations/delete/{id}:
 *  delete:
 *     tags:
 *     - Organization Location
 *     summary: Delete a organization-locations by id  
 *     description: Delete a organization-locations by id
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