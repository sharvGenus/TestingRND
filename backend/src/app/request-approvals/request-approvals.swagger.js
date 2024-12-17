// Swager API doc for /request/create and controller function createRequest
/**
 * @swagger
 * /request/create:
 *  post:
 *     tags:
 *     - Request and Approval
 *     summary: Create new Request
 *     description: Create new Request
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              payload:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     requestName:
 *                       type: string
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     requestOrganizationId:
 *                       type: string
 *                       format: uuid
 *                     requestStoreId:
 *                       type: string
 *                       format: uuid
 *                     approverStoreId:
 *                       type: string
 *                       format: uuid
 *                     projectId:
 *                       type: string
 *                       format: uuid
 *                     fromStoreId:
 *                       type: string
 *                       format: uuid
 *                     fromStoreLocationId:
 *                       type: string
 *                       format: uuid
 *                     toProjectId:
 *                       type: string
 *                       format: uuid
 *                     toStoreId:
 *                       type: string
 *                       format: uuid
 *                     toStoreLocationId:
 *                       type: string
 *                       format: uuid
 *                     materialId:
 *                       type: string
 *                       format: uuid
 *                     uomId:
 *                       type: string
 *                       format: uuid
 *                     serialNumber:
 *                       type: array
 *                       items:
 *                         type: string
 *                     requestedQuantity:
 *                       type: integer
 *                     approvedQuantity:
 *                       type: integer
 *                     rate:
 *                       type: number
 *                       format: float
 *                     value:
 *                       type: number
 *                       format: float
 *                     tax:
 *                       type: number
 *                       format: float
 *                     remarks:
 *                       type: string
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

// Swager API doc for /request/details/:id and controller function getRequestDetails
/**
 * @swagger
 * /request/details/{id}:
 *  get:
 *     tags:
 *     - Request and Approval
 *     summary: Returns a request by id  
 *     description: Returns a request by id
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

// Swager API doc for /request/list and controller function getAllRequests
/**
 * @swagger
 * /request/list:
 *  get:
 *     tags:
 *     - Request and Approval
 *     summary: Returns all requests
 *     description: /request/list?transactionTypeId=UUID&referenceDocumentNumber=DOC_NUMBER&projectId=UUID&fromStoreId=UUID&toStoreId=UUID&excludeCancel=EXCLUDE_CANCEL_STATUS&status=CANCELLED_STATUS&approvalStatus=APPROVAL_STATUS&isProcessed=IS_PROCESSED&sort=createdAt&sort=DESC
 *     parameters:
 *      - name: transactionTypeId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: referenceDocumentNumber
 *        in: query
 *        schema:
 *          type : string
 *      - name: projectId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: fromStoreId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: toStoreId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: excludeCancel
 *        in: query
 *        schema:
 *          type: string
 *          enum: ["0", "1"]
 *      - name: status
 *        in: query
 *        schema:
 *          type: string
 *          enum: ["0", "1"]
 *      - name: approvalStatus
 *        in: query
 *        schema:
 *          type: string
 *          enum: ["0", "1", "2"]
 *      - name: isProcessed
 *        in: query
 *        schema:
 *          type: boolean
 *      - name: sort
 *        in: query
 *        schema:
 *          type : array
 *          items:
 *            type: string
 *          example: ["createdAt", "DESC"]
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

// Swager API doc for /cancel-request/create and controller function createCancelRequest
/**
 * @swagger
 * /cancel-request/create:
 *  post:
 *     tags:
 *     - Request and Approval
 *     summary: Create new Cancel Request
 *     description: Create new Cancel Request
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              payload:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     requestName:
 *                       type: string
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     requestTransactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     requestOrganizationId:
 *                       type: string
 *                       format: uuid
 *                     requestStoreId:
 *                       type: string
 *                       format: uuid
 *                     requestNumber:
 *                       type: string
 *                     projectId:
 *                       type: string
 *                       format: uuid
 *                     fromStoreId:
 *                       type: string
 *                       format: uuid
 *                     fromStoreLocationId:
 *                       type: string
 *                       format: uuid
 *                     toProjectId:
 *                       type: string
 *                       format: uuid
 *                     toStoreId:
 *                       type: string
 *                       format: uuid
 *                     toStoreLocationId:
 *                       type: string
 *                       format: uuid
 *                     materialId:
 *                       type: string
 *                       format: uuid
 *                     uomId:
 *                       type: string
 *                       format: uuid
 *                     serialNumber:
 *                       type: array
 *                       items:
 *                         type: string
 *                     requestedQuantity:
 *                       type: integer
 *                     approvedQuantity:
 *                       type: integer
 *                     rate:
 *                       type: number
 *                       format: float
 *                     value:
 *                       type: number
 *                       format: float
 *                     tax:
 *                       type: number
 *                       format: float
 *                     serialNumbers:
 *                       type: string
 *                     vehicleNumber:
 *                       type: string
 *                     remarks:
 *                       type: string
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

// Swager API doc for /request-approver/list and controller function getAllRequestApprovers
/**
 * @swagger
 * /request-approver/list:
 *  get:
 *     tags:
 *     - Request and Approval
 *     summary: Returns all request approvers
 *     description: /request-approver/list?transactionTypeId=UUID&requestNumber=REQUEST_NUMBER&storeId=UUID&sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: transactionTypeId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: requestNumber
 *        in: query
 *        schema:
 *          type : string
 *      - name: storeId
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

// Swager API doc for /approve-reject-request/create and controller function approveRejectRequest
/**
 * @swagger
 * /approve-reject-request/create:
 *  post:
 *     tags:
 *     - Request and Approval
 *     summary: Approve or reject a Request
 *     description: Approve or reject a Request
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              transactionTypeId:
 *                type: string
 *                format: uuid
 *              projectId:
 *                type: string
 *                format: uuid
 *              requestNumber:
 *                type: string
 *              requestName:
 *                type: string
 *              storeId:
 *                type: string
 *                format: uuid
 *              approverStoreId:
 *                type: string
 *                format: uuid
 *              approverId:
 *                type: string
 *                format: uuid
 *              rank:
 *                type: integer
 *                default: 1
 *              status:
 *                type: string
 *                enum: [0, 1]
 *                default: 1
 *              remarks:
 *                type: string
 *              approvedMaterials:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     approvedQuantity:
 *                       type: integer
 *                     value:
 *                       type: number
 *                       format: float
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