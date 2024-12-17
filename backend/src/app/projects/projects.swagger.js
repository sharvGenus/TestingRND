// Swager API doc for /project/create and controller function createProject
/**
 * @swagger
 * /project/create:
 *  post:
 *     tags:
 *     - Project
 *     summary: Create a new project
 *     description: Create a new project
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              companyId:
 *                type: string
 *                format: uuid
 *              customerId:
 *                type: string
 *                format: uuid
 *              name:
 *                type: string
 *              schemeName:
 *                type: string
 *              code:
 *                type: string
 *              integrationId:
 *                type: string
 *                format: uuid
 *              poWorkOrderNumber:
 *                 type: string
 *              poStartDate:
 *                type: string
 *                format: date
 *              poEndDate:
 *                type: string
 *                format: date
 *              poExtensionDate:
 *                type: string
 *                format: date
 *              closureDate:
 *                type: string
 *                format: date
 *              fmsStartDate:
 *                type: string
 *                format: date
 *              fmsEndDate:
 *                type: string
 *                format: date
 *              fmsYears:
 *                 type: string
 *              eWayBillLimit:
 *                 type: number
 *                 format: float
 *              attachments:
 *                 type: string
 *              status:
 *                 type: string
 *                 enum: [0, 1]
 *                 default: 1
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
// Swager API doc for /project/update/:id and controller function updateProject
/**
 * @swagger
 * /project/update/{id}:
 *  put:
 *     tags:
 *     - Project
 *     summary: Update a project by id  
 *     description: Update a project by id
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
 *              companyId:
 *                type: string
 *                format: uuid
 *              customerId:
 *                type: string
 *                format: uuid
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              integrationId:
 *                type: string
 *                format: uuid
 *              poWorkOrderNumber:
 *                 type: string
 *              poStartDate:
 *                type: string
 *                format: date
 *              poEndDate:
 *                type: string
 *                format: date
 *              poExtensionDate:
 *                type: string
 *                format: date
 *              closureDate:
 *                type: string
 *                format: date
 *              fmsStartDate:
 *                type: string
 *                format: date
 *              fmsEndDate:
 *                type: string
 *                format: date
 *              fmsYears:
 *                 type: string
 *              eWayBillLimit:
 *                 type: number
 *                 format: float
 *              attachments:
 *                 type: string
 *              status:
 *                 type: string
 *                 enum: [0, 1]
 *                 default: 1
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
// Swager API doc for /project/details/:id and controller function getProjectDetails
/**
 * @swagger
 * /project/details/{id}:
 *  get:
 *     tags:
 *     - Project
 *     summary: Returns a project by id  
 *     description: Returns a project by id
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
// Swager API doc for /project/list and controller function getAllProjects
/**
 * @swagger
 * /project/list:
 *  get:
 *     tags:
 *     - Project
 *     summary: Returns all project  
 *     description: Return all project
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
// Swager API doc for /project/delete/:id and controller function deleteProject
/**
 * @swagger
 * /project/delete/{id}:
 *  delete:
 *     tags:
 *     - Project
 *     summary: Delete a project by id  
 *     description: Delete a project by id
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
// Swager API doc for /project/dropdown/list and controller function getAllProjectByDropdown
/**
 * @swagger
 * /project/dropdown/list:
 *  get:
 *     tags:
 *     - Project
 *     summary: get all project name and id
 *     description: get all project name and id
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