// Swager API doc for /devolution/create and controller function createDevolution
/**
 * @swagger
 * /devolution/create:
 *  post:
 *     tags:
 *     - Devolution
 *     summary: Create devolution
 *     description: Create devolution
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
 *              formId:
 *                 type: string
 *                 format: uuid
 *              customerId:
 *                 type: string
 *                 format: uuid
 *              customerStoreId:
 *                 type: string
 *                 format: uuid
 *              gaaHierarchy:
 *                 type: object
 *                 properties:
 *                   circle_name:
 *                     type: string
 *                     format: uuid
 *              devolution_materials:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     responseId:
 *                       type: string
 *                       format: uuid
 *                     oldSerialNo:
 *                       type: string
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

// Swager API doc for /devolution/list and controller function getDevolutionList
/**
 * @swagger
 * /devolution/list:
 *  get:
 *     tags:
 *     - Devolution
 *     summary: Returns devolution list
 *     description: /devolution/list?projectId=UUID&formId=UUID&customerId=UUID&customerStoreId=UUID&sort=createdAt&sort=DESC&rowPerPage=25&pageNumber=1
 *     parameters:
 *      - name: projectId
 *        in: query
 *        schema:
 *          type: string
 *          format: uuid
 *      - name: formId
 *        in: query
 *        schema:
 *          type: string
 *          format: uuid
 *      - name: customerId
 *        in: query
 *        schema:
 *          type: string
 *          format: uuid
 *      - name: customerStoreId
 *        in: query
 *        schema:
 *          type: string
 *          format: uuid
 *      - name: approvalStatus
 *        in: query
 *        schema:
 *          type: string
 *          enum: ["0", "1", "2"]
 *          default: "2"
 *      - name: gaa
 *        in: query
 *        schema:
 *          type: object
 *          properties:
 *            gaaHierarchy:
 *               type: object
 *               properties:
 *                 circle_name:
 *                   type: string
 *                   format: uuid
 *      - name: sort
 *        in: query
 *        schema:
 *          type: array
 *          items:
 *            type: string
 *          example: ["createdAt", "DESC"]
 *      - name: rowPerPage
 *        in: query
 *        schema:
 *          type: integer
 *        example: 25
 *      - name: pageNumber
 *        in: query
 *        schema:
 *          type: integer
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

// Swager API doc for /devolution-details/:id and controller function getDevolutionDetails
/**
 * @swagger
 * /devolution-details/{id}:
 *  get:
 *     tags:
 *     - Devolution
 *     summary: Returns devolution details by id
 *     description: Returns devolution details by id
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
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

// Swager API doc for /devolution-material/list and controller function getDevolutionMaterialList
/**
 * @swagger
 * /devolution-material/list:
 *  get:
 *     tags:
 *     - Devolution
 *     summary: Returns devolution list
 *     description: /devolution-material/list?devolutionId=UUID&rowPerPage=25&pageNumber=1
 *     parameters:
 *      - name: devolutionId
 *        in: query
 *        schema:
 *          type: string
 *          format: uuid
 *      - name: rowPerPage
 *        in: query
 *        schema:
 *          type: integer
 *        example: 25
 *      - name: pageNumber
 *        in: query
 *        schema:
 *          type: integer
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

// Swager API doc for /devolution/update/:id and controller function updateDevolution
/**
 * @swagger
 * /devolution/update/{id}:
 *  put:
 *     tags:
 *     - Devolution
 *     summary: Update devolution by id  
 *     description: Update devolution by id
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              attachments:
 *                type: array
 *                items:
 *                  type: string
 *     responses:
 *      200:
 *        description: Created
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Internal Error
 */

// Swager API doc for /devolution-approve-reject/:id and controller function devolutionApproveReject
/**
 * @swagger
 * /devolution-approve-reject/{id}:
 *  put:
 *     tags:
 *     - Devolution
 *     summary: Approve or reject devolution
 *     description: Approve or reject devolution
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              approvalStatus:
 *                 type: string
 *                 enum: ["0", "1"]
 *                 default: "1"
 *              approvedResponseIds:
 *                 type: array
 *                 items:
 *                   type: string 
 *                   format: uuid
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

// Swager API doc for /devolution-form-data and controller function getDevolutionFormData
/**
 * @swagger
 * /devolution-form-data:
 *  post:
 *     tags:
 *     - Devolution
 *     summary: Get form data for devolution
 *     description: Get form data for devolution
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
 *              formId:
 *                 type: string
 *                 format: uuid
 *              gaaLevelFilter:
 *                 type: object
 *                 properties:
 *                   circle_name:
 *                     type: string
 *                     format: uuid
 *              newSerialNoPrefix:
 *                type: string
 *              fromNewSerialNo:
 *                type: string
 *              toNewSerialNo:
 *                type: string
 *              fromDate:
 *                type: string
 *                format: date
 *              toDate:
 *                type: string
 *                format: date
 *              forMaterialPopup:
 *                type: boolean
 *              selectedResponseIds:
 *                 type: array
 *                 items:
 *                   type: string 
 *                   format: uuid
 *              devolutionId:
 *                 type: string
 *                 format: uuid
 *              isRejected:
 *                type: boolean
 *              pageNumber:
 *                 type: integer
 *                 default: 1
 *              rowPerPage:
 *                 type: integer
 *                 default: 25
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