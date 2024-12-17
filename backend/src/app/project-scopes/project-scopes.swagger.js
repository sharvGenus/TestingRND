// Swager API doc for /project-scope/create and controller function createProjectScope
/**
 * @swagger
 * /project-scope/create:
 *  post:
 *     tags:
 *     - Project Scope
 *     summary: Create project scope
 *     description: Create project scope
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              projectId:
 *                type: string
 *                format: uuid
 *              formId:
 *                type: string
 *                format: uuid
 *              materialTypeId:
 *                type: string
 *                format: uuid
 *              uomId:
 *                type: string
 *                format: uuid
 *              orderQuantity:
 *                type: number
 *                format: float
 *              installationMonth:
 *                type: number
 *                format: float
 *              installationEndDate:
 *                type: string
 *                format: date
 *              installationMonthIncentive:
 *                type: number
 *                format: float
 *              installationEndDateIncentive:
 *                type: string
 *                format: date
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

// Swager API doc for /project-scope/list and controller function getProjectScopeList
/**
 * @swagger
 * /project-scope/list:
 *  get:
 *     tags:
 *     - Project Scope
 *     summary: Returns project scope list 
 *     description: /project-scope/list?projectId=UUID&sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: projectId
 *        in: query
 *        required: true
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

// Swager API doc for /project-scope/update/:id and controller function updateProjectScope
/**
 * @swagger
 * /project-scope/update/{id}:
 *  put:
 *     tags:
 *     - Project Scope
 *     summary: Update project scope by id  
 *     description: Update project scope by id
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
 *                type: string
 *                format: uuid
 *              formId:
 *                type: string
 *                format: uuid
 *              materialTypeId:
 *                type: string
 *                format: uuid
 *              uomId:
 *                type: string
 *                format: uuid
 *              orderQuantity:
 *                type: number
 *                format: float
 *              installationMonth:
 *                type: number
 *                format: float
 *              installationEndDate:
 *                type: string
 *                format: date
 *              installationMonthIncentive:
 *                type: number
 *                format: float
 *              installationEndDateIncentive:
 *                type: string
 *                format: date
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

// Swager API doc for /project-scope/delete/:id and controller function deleteProjectScope
/**
 * @swagger
 * /project-scope/delete/{id}:
 *  delete:
 *     tags:
 *     - Project Scope
 *     summary: Delete project scope by id
 *     description: Delete project scope by id
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type : string
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

// Swager API doc for /project-scope/history/:recordId and controller function getProjectScopeHistory
/**
 * @swagger
 * /project-scope/history/{recordId}:
 *  get:
 *     tags:
 *     - Project Scope
 *     summary: Get project scope history by recordId
 *     description: /project-scope/history/{recordId}?sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: recordId
 *        in: path
 *        required: true
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

// Swager API doc for /project-scope-extension/create and controller function createProjectScopeExtension
/**
 * @swagger
 * /project-scope-extension/create:
 *  post:
 *     tags:
 *     - Project Scope
 *     summary: Create project scope extension
 *     description: Create project scope extension
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              projectScopeId:
 *                type: string
 *                format: uuid
 *              extensionQuantity:
 *                type: number
 *                format: float
 *              extensionStartDate:
 *                type: string
 *                format: date
 *              extensionMonth:
 *                type: number
 *                format: float
 *              extensionEndDate:
 *                type: string
 *                format: date
  *              documentNumber:
 *                type: string
 *              documentDate:
 *                type: string
 *                format: date
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

// Swager API doc for /project-scope-extension/list and controller function getProjectScopeExtensionList
/**
 * @swagger
 * /project-scope-extension/list:
 *  get:
 *     tags:
 *     - Project Scope
 *     summary: Returns project scope extension list 
 *     description: /project-scope-extension/list?projectScopeId=UUID&sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: projectScopeId
 *        in: query
 *        required: true
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

// Swager API doc for /project-scope-extension/update/:id and controller function updateProjectScopeExtension
/**
 * @swagger
 * /project-scope-extension/update/{id}:
 *  put:
 *     tags:
 *     - Project Scope
 *     summary: Update project scope extension by id  
 *     description: Update project scope extension by id
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
 *              projectScopeId:
 *                type: string
 *                format: uuid
 *              extensionQuantity:
 *                type: number
 *                format: float
 *              extensionStartDate:
 *                type: string
 *                format: date
 *              extensionMonth:
 *                type: number
 *                format: float
 *              extensionEndDate:
 *                type: string
 *                format: date
  *              documentNumber:
 *                type: string
 *              documentDate:
 *                type: string
 *                format: date
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

// Swager API doc for /project-scope-extension/delete/:id and controller function deleteProjectScopeExtension
/**
 * @swagger
 * /project-scope-extension/delete/{id}:
 *  delete:
 *     tags:
 *     - Project Scope
 *     summary: Delete project scope extension by id
 *     description: Delete project scope extension by id
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type : string
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

// Swager API doc for /project-scope-extension/history/:recordId and controller function getProjectScopeExtensionHistory
/**
 * @swagger
 * /project-scope-extension/history/{recordId}:
 *  get:
 *     tags:
 *     - Project Scope
 *     summary: Get project scope extension history by recordId
 *     description: /project-scope-extension/history/{recordId}?sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: recordId
 *        in: path
 *        required: true
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

// Swager API doc for /project-scope-sat/create and controller function createProjectScopeSat
/**
 * @swagger
 * /project-scope-sat/create:
 *  post:
 *     tags:
 *     - Project Scope
 *     summary: Create project scope sat
 *     description: Create project scope sat
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              projectScopeId:
 *                type: string
 *                format: uuid
 *              satExecutionQuantity:
 *                type: number
 *                format: float
 *              satExecutionDate:
 *                type: string
 *                format: date
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

// Swager API doc for /project-scope-sat/list and controller function getProjectScopeSatList
/**
 * @swagger
 * /project-scope-sat/list:
 *  get:
 *     tags:
 *     - Project Scope
 *     summary: Returns project scope sat list 
 *     description: /project-scope-sat/list?projectScopeId=UUID&sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: projectScopeId
 *        in: query
 *        required: true
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

// Swager API doc for /project-scope-sat/update/:id and controller function updateProjectScopeSat
/**
 * @swagger
 * /project-scope-sat/update/{id}:
 *  put:
 *     tags:
 *     - Project Scope
 *     summary: Update project scope sat by id  
 *     description: Update project scope sat by id
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
 *              projectScopeId:
 *                type: string
 *                format: uuid
 *              satExecutionQuantity:
 *                type: number
 *                format: float
 *              satExecutionDate:
 *                type: string
 *                format: date
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

// Swager API doc for /project-scope-sat/delete/:id and controller function deleteProjectScopeSat
/**
 * @swagger
 * /project-scope-sat/delete/{id}:
 *  delete:
 *     tags:
 *     - Project Scope
 *     summary: Delete project scope sat by id
 *     description: Delete project scope sat by id
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type : string
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

// Swager API doc for /project-scope-sat/history/:recordId and controller function getProjectScopeSatHistory
/**
 * @swagger
 * /project-scope-sat/history/{recordId}:
 *  get:
 *     tags:
 *     - Project Scope
 *     summary: Get project scope sat history by recordId
 *     description: /project-scope-sat/history/{recordId}?sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: recordId
 *        in: path
 *        required: true
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