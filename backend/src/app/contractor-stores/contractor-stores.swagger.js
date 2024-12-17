// Swager API doc for /contractor-stores/create and controller function createProjectsitestore
/**
 * @swagger
 * /contractor-stores/create:
 *  post:
 *     tags:
 *     - Contractor Store
 *     summary: Create a new contractor-stores
 *     description: Create a new contractor-stores
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              projectId:
 *                 type: string
 *                 format: uuid
 *              firmId:
 *                 type: string
 *                 format: uuid
 *              integrationId:
 *                type: string
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              photo:
 *                type: string
 *              gstNumber:
 *                 type: string
 *              email:
 *                 type: string
 *              mobileNumber:
 *                 type: string
 *              telephone:
 *                 type: string
 *              registeredOfficeAddress:
 *                 type: string
 *              registeredOfficeCityId:
 *                 type: string
 *                 format: uuid
 *              registeredOfficePinCode:
 *                 type: string
 *              currentOfficeAddress:
 *                 type: string
 *              currentOfficeCityId:
 *                 type: string
 *                 format: uuid
 *              currentOfficePinCode:
 *                 type: string
 *              attachments:
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

// Swager API doc for /contractor-stores/update/:id and controller function updatelocation-site-store
/**
 * @swagger
 * /contractor-stores/update/{id}:
 *  put:
 *     tags:
 *     - Contractor Store
 *     summary: Update a contractor-stores by id  
 *     description: Update a contractor-stores by id
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
 *              firmtId:
 *                 type: string
 *                 format: uuid
 *              projectId:
 *                 type: string
 *                 format: uuid
 *              integrationId:
 *                type: string
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              photo:
 *                type: string
 *              gstNumber:
 *                 type: string
 *              email:
 *                 type: string
 *              mobileNumber:
 *                 type: string
 *              telephone:
 *                 type: string
 *              registeredOfficeAddress:
 *                 type: string
 *              registeredOfficeCityId:
 *                 type: string
 *                 format: uuid
 *              registeredOfficePinCode:
 *                 type: string
 *              currentOfficeAddress:
 *                 type: string
 *              currentOfficeCityId:
 *                 type: string
 *                 format: uuid
 *              currentOfficePinCode:
 *                 type: string
 *              attachments:
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

// Swager API doc for /contractor-stores/details/:id and controller function getlocation-site-storeDetails
/**
 * @swagger
 * /contractor-stores/details/{id}:
 *  get:
 *     tags:
 *     - Contractor Store
 *     summary: Returns a contractor-stores by id  
 *     description: Returns a contractor-stores by id
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

// Swager API doc for /contractor-stores/list and controller function getAlllocation-site-stores
/**
 * @swagger
 * /contractor-stores/list:
 *  get:
 *     tags:
 *     - Contractor Store
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

// Swager API doc for /contractor-stores/delete/:id and controller function deletelocation-site-store
/**
 * @swagger
 * /contractor-stores/delete/{id}:
 *  delete:
 *     tags:
 *     - Contractor Store
 *     summary: Delete a contractor-stores by id  
 *     description: Delete a contractor-stores by id
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