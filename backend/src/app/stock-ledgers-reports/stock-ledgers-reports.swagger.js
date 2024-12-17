// Swager API doc for /delivery-report/list and controller function getAllDeliveryReportDetails
/**
 * @swagger
 * /delivery-report/list:
 *  get:
 *     tags:
 *     - Stock Ledger Reports
 *     summary: Returns get all delivery report details
 *     description: /stock-ledger-detail/list?transactionTypeId=UUID&projectId=UUID&storeId=UUID&fromDate=DATE&toDate=DATE&sort=createdAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: transactionTypeId
 *        in: query
 *        required: true
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: projectId
 *        in: query
 *        required: true
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: storeId
 *        in: query
 *        required: true
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: fromDate
 *        in: query
 *        schema:
 *          type : string
 *          format: date
 *      - name: toDate
 *        in: query
 *        schema:
 *          type : string
 *          format: date
 *      - name: sort
 *        in: query
 *        schema:
 *          type : array
 *          items:
 *            type: string
 *          example: ["createdAt", "DESC"]
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
// Swager API doc for /contractor-reconciliation/list and controller function getAllContractorReconciliationReportDetails
/**
 * @swagger
 * /contractor-reconciliation/list:
 *  get:
 *     tags:
 *     - Stock Ledger Reports
 *     summary: Returns get all contractor-reconciliation report details
 *     description: /stock-ledger-detail/list?projectId=UUID&organizationId=UUID&storeId=UUID&sort=createdAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: projectId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: organizationId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
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
 *          example: ["createdAt", "DESC"]
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
// Swager API doc for /contractor-report/list and controller function getAllContractorReportDetails
/**
 * @swagger
 * /contractor-report/list:
 *  get:
 *     tags:
 *     - Stock Ledger Reports
 *     summary: Returns get all contractor report details
 *     description: /stock-ledger-detail/list?projectId=UUID&organizationId=UUID&storeId=UUID&materialId=UUID&sort=createdAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: projectId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: organizationId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: storeId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: materialId
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
 *          example: ["createdAt", "DESC"]
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
// Swager API doc for /stock-report/list and controller function getAllStockReportDetails
/**
 * @swagger
 * /stock-report/list:
 *  get:
 *     tags:
 *     - Stock Ledger Reports
 *     summary: Returns get all Stock Report report details
 *     description: /stock-ledger-detail/list?projectId=UUID&organizationId=UUID&storeId=UUID&sort=createdAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: projectId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: organizationId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
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
 *          example: ["createdAt", "DESC"]
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
// Swager API doc for /aging-material-report/list and controller function getAllAgingOfMaterialReportDetails
/**
 * @swagger
 * /aging-material-report/list:
 *  get:
 *     tags:
 *     - Stock Ledger Reports
 *     summary: Returns get all Aging of Material Report report details
 *     description: /stock-ledger-detail/list?projectId=UUID&organizationId=UUID&storeId=UUID&sort=createdAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: projectId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: organizationId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
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
 *          example: ["createdAt", "DESC"]
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
// Swager API doc for /document-wise-report/list and controller function getAllDeliveryReportDetails
/**
 * @swagger
 * /document-wise-report/list:
 *  get:
 *     tags:
 *     - Stock Ledger Reports
 *     summary: Returns get All Delivery Report Details
 *     description: /document-wise-report/list?transactionTypeId=UUID&projectId=UUID&storeId=UUID&fromDate=DATE&toDate=DATE&sort=createdAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: transactionTypeId
 *        in: query
 *        required: true
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: projectId
 *        in: query
 *        required: true
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: storeId
 *        in: query
 *        required: true
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: fromDate
 *        in: query
 *        schema:
 *          type : string
 *          format: date
 *      - name: toDate
 *        in: query
 *        schema:
 *          type : string
 *          format: date
 *      - name: sort
 *        in: query
 *        schema:
 *          type : array
 *          items:
 *            type: string
 *          example: ["createdAt", "DESC"]
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

// Swager API doc for /store-stock-report and controller function stockReport
/**
 * @swagger
 * /store-stock-report:
 *  get:
 *     tags:
 *     - Stock Ledger Reports
 *     summary: Returns store stock report
 *     description: /store-stock-report?projectId=UUID&storeId=UUID&materialId=UUID&storeLocationId=UUID&installerId=UUID
 *     parameters:
 *      - name: projectId
 *        in: query
 *        required: true
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: storeId
 *        in: query
 *        required: true
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: storeLocationId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: materialId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: installerId
 *        in: query
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

// Swager API doc for /get-material-types-for-report and controller function getMaterialTypesForReport
/**
 * @swagger
 * /get-material-types-for-report:
 *  get:
 *     tags:
 *     - Stock Ledger Reports
 *     summary: Returns material type list for reports
 *     description: /get-material-types-for-report?projectId=UUID&contractorId=UUID&storeId=UUID&sort=updatedAt&sort=DESC
 *     parameters:
 *      - name: projectId
 *        in: query
 *        required: true
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: contractorId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
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

// Swager API doc for /store-wise-material-summary-report and controller function storeWiseMaterialSummaryReport
/**
 * @swagger
 * /store-wise-material-summary-report:
 *  get:
 *     tags:
 *     - Stock Ledger Reports
 *     summary: Returns store wise material summary report
 *     description: /store-wise-material-summary-report?projectId=UUID&storeId=UUID&materialTypeId=UUID&sort=updatedAt&sort=DESC
 *     parameters:
 *      - name: projectId
 *        in: query
 *        required: true
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: storeId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: materialTypeId
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

// Swager API doc for /contractor-wise-material-summary-report and controller function contractorWiseMaterialSummaryReport
/**
 * @swagger
 * /contractor-wise-material-summary-report:
 *  get:
 *     tags:
 *     - Stock Ledger Reports
 *     summary: Returns contractor wise material summary report
 *     description: /contractor-wise-material-summary-report?projectId=UUID&contractorId=UUID&storeId=UUID&materialTypeId=UUID&sort=updatedAt&sort=DESC
 *     parameters:
 *      - name: projectId
 *        in: query
 *        required: true
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: contractorId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: storeId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: materialTypeId
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

// Swager API doc for /material-grn-report and controller function materialGrnReport
/**
 * @swagger
 * /material-grn-report:
 *  get:
 *     tags:
 *     - Stock Ledger Reports
 *     summary: Returns material GRN report
 *     description: /material-grn-report?projectId=UUID&&materialTypeId=UUID&itemSerialNoFrom=FROM_SERIAL_NO&itemSerialNoTo=TO_SERIAL_NO&dateFrom=FROM_DATE&dateTo=TO_DATE&rowPerPage=25&pageNumber=1
 *     parameters:
 *      - name: projectId
 *        in: query
 *        required: true
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: materialTypeId
 *        in: query
 *        required: true
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: itemSerialNoFrom
 *        in: query
 *        schema:
 *          type : string
 *      - name: itemSerialNoTo
 *        in: query
 *        schema:
 *          type : string
 *      - name: dateFrom
 *        in: query
 *        schema:
 *          type : string
 *          format: date
 *      - name: dateTo
 *        in: query
 *        schema:
 *          type : string
 *          format: date
 *      - name: rowPerPage
 *        in: query
 *        schema:
 *          type : integer
 *        example: 25
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