// Swager API doc for /organization-store/create and controller function createOrganizationStore
/**
 * @swagger
 * /organization-store/create:
 *  post:
 *     tags:
 *     - Organization Store
 *     summary: Create a new organization store
 *     description: Create a new organization store
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
 *              organizationId:
 *                type: string
 *                format: uuid
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              integrationId:
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
 *              pincode:
 *                 type: string
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

// Swager API doc for /organization-store/update/:id and controller function updateOrganizationStore
/**
 * @swagger
 * /organization-store/update/{id}:
 *  put:
 *     tags:
 *     - Organization Store
 *     summary: Update a organization store by id  
 *     description: Update a organization store by id
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
 *              organizationId:
 *                type: string
 *                format: uuid
 *              name:
 *                type: string
 *              code:
 *                type: integer
 *              integrationId:
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
 *              pincode:
 *                 type: string
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

// Swager API doc for /organization-store/details/:id and controller function getOrganizationStoreDetails
/**
 * @swagger
 * /organization-store/details/{id}:
 *  get:
 *     tags:
 *     - Organization Store
 *     summary: Returns a organization store by id  
 *     description: Returns a organization store by id
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

// Swager API doc for /organization-store/list and controller function getAllOrganizationStores
/**
 * @swagger
 * /organization-store/list:
 *  get:
 *     tags:
 *     - Organization Store
 *     summary: Returns all organization stores  
 *     description: /organization-store/list?organizationType=UUID&sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
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

// Swager API doc for /organization-store/delete/:id and controller function deleteOrganizationStore
/**
 * @swagger
 * /organization-store/delete/{id}:
 *  delete:
 *     tags:
 *     - Organization Store
 *     summary: Delete a organization store by id  
 *     description: Delete a organization store by id
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

// Swager API doc for /organization-store/data and controller function getOrganizationStores
/**
 * @swagger
 * /organization-store/data:
 *  get:
 *     tags:
 *     - Organization Store
 *     summary: Returns all organization stores  
 *     description: /organization-store/data?organizationType=UUID&organizationId=UUID&sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: organizationType 
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: organizationId 
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