// Swager API doc for /organization-store-location/create and controller function createOrganizationStoreLocation
/**
 * @swagger
 * /organization-store-location/create:
 *  post:
 *     tags:
 *     - Organization Store Location
 *     summary: Create a new organization store location
 *     description: Create a new organization store location
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              organizationType:
 *                type: string
 *                format: uuid
 *              organizationStoreId:
 *                type: string
 *                format: uuid
 *              projectId:
 *                type: string
 *                format: uuid
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              integrationId:
 *                type: string
 *              isRestricted:
 *                 type: boolean
 *              attachments:
 *                 type: string
 *              storePhoto:
 *                 type: string
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

// Swager API doc for /organization-store-location/update/:id and controller function updateOrganizationStoreLocation
/**
 * @swagger
 * /organization-store-location/update/{id}:
 *  put:
 *     tags:
 *     - Organization Store Location
 *     summary: Update a organization store location by id  
 *     description: Update a organization store location by id
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
 *              organizationType:
 *                type: string
 *                format: uuid
 *              organizationStoreId:
 *                type: string
 *                format: uuid
 *              projectId:
 *                type: string
 *                format: uuid
 *              name:
 *                type: string
 *              code:
 *                type: integer
 *              integrationId:
 *                type: string
 *              isRestricted:
 *                 type: boolean
 *              attachments:
 *                 type: string
 *              storePhoto:
 *                 type: string
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

// Swager API doc for /organization-store-location/details/:id and controller function getOrganizationStoreLocationDetails
/**
 * @swagger
 * /organization-store-location/details/{id}:
 *  get:
 *     tags:
 *     - Organization Store Location
 *     summary: Returns a organization store location by id  
 *     description: Returns a organization store location by id
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

// Swager API doc for /organization-store-location/list and controller function getAllOrganizationStoreLocations
/**
 * @swagger
 * /organization-store-location/list:
 *  get:
 *     tags:
 *     - Organization Store Location
 *     summary: Returns all organization store locations  
 *     description: /organization-store-location/list?organizationType=UUID&sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: organizationType 
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: sort
 *        in: query
 *        schema:
 *          type : array
 *          items:
 *            type: string
 *          example: ["updatedAt", "DESC"]
 *      - name: rowPerPage
 *        in: query
 *        schema:
 *          type : integer
 *        example: 10
 *      - name: pageNumber
 *        in: query
 *        schema:
 *          type : integer
 *        example: 1
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

// Swager API doc for /organization-store-location/delete/:id and controller function deleteOrganizationStoreLocation
/**
 * @swagger
 * /organization-store-location/delete/{id}:
 *  delete:
 *     tags:
 *     - Organization Store Location
 *     summary: Delete a organization store location by id  
 *     description: Delete a organization store location by id
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

// Swager API doc for /organization-store-location-list/data and controller function getOrganizationStoreLocations
/**
 * @swagger
 * /organization-store-location-list/data:
 *  get:
 *     tags:
 *     - Organization Store Location
 *     summary: Returns all organization store location without access  
 *     description: /organization-store-location-list/data?organizationType=UUID&organizationStoreId=UUID&sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: organizationType 
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: organizationStoreId 
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: sort
 *        in: query
 *        schema:
 *          type : array
 *          items:
 *            type: string
 *          example: ["updatedAt", "DESC"]
 *      - name: rowPerPage
 *        in: query
 *        schema:
 *          type : integer
 *        example: 10
 *      - name: pageNumber
 *        in: query
 *        schema:
 *          type : integer
 *        example: 1
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