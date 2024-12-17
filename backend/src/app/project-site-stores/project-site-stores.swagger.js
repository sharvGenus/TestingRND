// Swager API doc for /Project-site-store/create and controller function create Project-site-stores
/**
 * @swagger
 * /project-site-stores/create:
 *  post:
 *     tags:
 *     - Project Site Store
 *     summary: Create a new project-site-stores
 *     description: Create a new project-site-stores
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

// Swager API doc for /project-site-stores/update/:id and controller function update Project-site-stores
/**
 * @swagger
 * /project-site-stores/update/{id}:
 *  put:
 *     tags:
 *     - Project Site Store
 *     summary: Update a project-site-stores by id  
 *     description: Update a project-site-stores by id
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

// Swager API doc for /project-site-stores/details/:id and controller function get Project-site-storeDetails
/**
 * @swagger
 * /project-site-stores/details/{id}:
 *  get:
 *     tags:
 *     - Project Site Store
 *     summary: Returns a project-site-stores by id  
 *     description: Returns a project-site-stores by id
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

// Swager API doc for /project-site-stores/list and controller function getAll Project-site-stores
/**
 * @swagger
 * /project-site-stores/list:
 *  get:
 *     tags:
 *     - Project Site Store
 *     summary: Returns all project-site-stores  
 *     description: Return all project-site-stores
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

// Swager API doc for /project-site-stores/delete/:id and controller function delete Project-site-store
/**
 * @swagger
 * /project-site-stores/delete/{id}:
 *  delete:
 *     tags:
 *     - Project Site Store
 *     summary: Delete a project-site-stores by id  
 *     description: Delete a project-site-stores by id
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