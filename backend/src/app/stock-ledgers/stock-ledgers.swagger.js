// Swager API doc for /stock-ledger/create and controller function createStockLedger
/**
 * @swagger
 * /stock-ledger/create:
 *  post:
 *     tags:
 *     - Stock Ledger
 *     summary: Create new stock ledger
 *     description: Create new stock ledger
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
 *              toOrganizationId:
 *                type: string
 *                format: uuid
 *              invoiceNumber:
 *                type: string
 *              invoiceDate:
 *                type: string
 *                format: date
 *              challanNumber:
 *                type: string
 *              challanDate:
 *                type: string
 *                format: date
 *              poNumber:
 *                type: string
 *              poDate:
 *                type: string
 *                format: date
 *              transporterName:
 *                type: string
 *              transporterContactNumber:
 *                type: string
 *              vehicleNumber:
 *                type: string
 *              lrNumber:
 *                type: string
 *              eWayBillNumber:
 *                type: string
 *              eWayBillDate:
 *                type: string
 *                format: date
 *              actualReceiptDate:
 *                type: string
 *                format: date
 *              remarks:
 *                type: string
 *              attachments:
 *                type: array
 *                items:
 *                  type: string
 *              stock_ledgers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     organizationId:
 *                       type: string
 *                       format: uuid
 *                     projectId:
 *                       type: string
 *                       format: uuid
 *                     requestNumber:
 *                       type: string
 *                     storeId:
 *                       type: string
 *                       format: uuid
 *                     storeLocationId:
 *                       type: string
 *                       format: uuid
 *                     materialId:
 *                       type: string
 *                       format: uuid
 *                     uomId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
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
 *                     approverId:
 *                       type: string
 *                       format: uuid
 *                     requestApprovalId:
 *                       type: string
 *                       format: uuid
 *                     remarks:
 *                       type: string
 *                     serialNumber:
 *                       type: array
 *                       items:
 *                         type: string
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

// Swager API doc for /stock-ledger-details/:id and controller function getStockLedgerDetails
/**
 * @swagger
 * /stock-ledger-details/{id}:
 *  get:
 *     tags:
 *     - Stock Ledger
 *     summary: Returns stock ledger details by id
 *     description: Returns stock ledger details by id
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

// Swager API doc for /stock-ledger-detail/list and controller function getAllStockLedgerDetails
/**
 * @swagger
 * /stock-ledger-detail/list:
 *  get:
 *     tags:
 *     - Stock Ledger
 *     summary: Returns all stock ledger details
 *     description: /stock-ledger-detail/list?transactionTypeId=UUID&referenceDocumentNumber=DOC_NUMBER&sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
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

// Swager API doc for /stock-ledger/list and controller function getAllStockLedgers
/**
 * @swagger
 * /stock-ledger/list:
 *  get:
 *     tags:
 *     - Stock Ledger
 *     summary: Returns all stock ledger
 *     description: /stock-ledger/list?transactionTypeId=UUID&requestNumber=REQUEST_NUMBER&referenceDocumentNumber=DOC_NUMBER&projectId=UUID&storeId=UUID&storeLocationId=UUID&materialId=UUID&isCancelled=IS_CANCELLED&isProcessed=IS_PROCESSED&sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
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
 *      - name: referenceDocumentNumber
 *        in: query
 *        schema:
 *          type : string
 *      - name: projectId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: storeId
 *        in: query
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
 *      - name: isCancelled
 *        in: query
 *        schema:
 *          type: boolean
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

// Swager API doc for /stock-ledger-with-serial-number/list and controller function getAllStockLedgersWithSerialNumber
/**
 * @swagger
 * /stock-ledger-with-serial-number/list:
 *  get:
 *     tags:
 *     - Stock Ledger
 *     summary: Returns all stock ledger with serial number
 *     description: /stock-ledger-with-serial-number/list?transactionTypeId=UUID&requestNumber=REQUEST_NUMBER&referenceDocumentNumber=DOC_NUMBER&projectId=UUID&storeId=UUID&storeLocationId=UUID&otherStoreId=UUID&materialId=UUID&isCancelled=IS_CANCELLED&isProcessed=IS_PROCESSED&sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
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
 *      - name: referenceDocumentNumber
 *        in: query
 *        schema:
 *          type : string
 *      - name: projectId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: storeId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: storeLocationId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: otherStoreId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: materialId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: isCancelled
 *        in: query
 *        schema:
 *          type: boolean
 *      - name: isProcessed
 *        in: query
 *        schema:
 *          type: boolean
 *      - name: isNegative
 *        in: query
 *        schema:
 *          type: boolean
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

// Swager API doc for /transaction-count-by-request and controller function getTransactionCountByRequestNumber
/**
 * @swagger
 * /transaction-count-by-request:
 *  get:
 *     tags:
 *     - Stock Ledger
 *     summary: Returns transaction count by requestNumber
 *     description: /transaction-count-by-request?requestNumber=REQUEST_NUMBER
 *     parameters:
 *      - name: requestNumber
 *        in: query
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

// Swager API doc for /min-transaction/create and controller function createMinTransaction
/**
 * @swagger
 * /min-transaction/create:
 *  post:
 *     tags:
 *     - Stock Ledger
 *     summary: Create new MIN (Material Issue Note) transaction
 *     description: Create MIN (Material Issue Note) transaction
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
 *              requestTransactionTypeId:
 *                type: string
 *                format: uuid
 *              requestNumber:
 *                type: string
 *              fromOrganizationId:
 *                type: string
 *                format: uuid
 *              fromStoreId:
 *                type: string
 *                format: uuid
 *              eWayBillNumber:
 *                type: string
 *              eWayBillDate:
 *                type: string
 *                format: date
 *              placeOfSupply:
 *                type: string
 *              vehicleNumber:
 *                type: string
 *              challanNumber:
 *                type: string
 *              poNumber:
 *                type: string
 *              remarks:
 *                type: string
 *              attachments:
 *                type: array
 *                items:
 *                  type: string
 *              stock_ledgers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     organizationId:
 *                       type: string
 *                       format: uuid
 *                     projectId:
 *                       type: string
 *                       format: uuid
 *                     requestNumber:
 *                       type: string
 *                     fromStoreLocationId:
 *                       type: string
 *                       format: uuid
 *                     storeId:
 *                       type: string
 *                       format: uuid
 *                     storeLocationId:
 *                       type: string
 *                       format: uuid
 *                     materialId:
 *                       type: string
 *                       format: uuid
 *                     uomId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
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
 *                     approverId:
 *                       type: string
 *                       format: uuid
 *                     requestApprovalId:
 *                       type: string
 *                       format: uuid
 *                     remarks:
 *                       type: string
 *                     serialNumber:
 *                       type: array
 *                       items:
 *                         type: string
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

// Swager API doc for /transaction/list and controller function getAllTransactionData
/**
 * @swagger
 * /transaction/list:
 *  get:
 *     tags:
 *     - Stock Ledger
 *     summary: Returns all stock ledger
 *     description: /transaction/list?projectId=UUID&storeId=UUID&materialId=UUID&sort=createdAt&sort=DESC
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
 *      - name: materialId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: withoutTransaction
 *        in: query
 *        schema:
 *          type : integer
 *          enum: [0, 1]
 *          default: 0
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

// Swager API doc for /txn-by-material/list and controller function getTxnsByMaterial
/**
 * @swagger
 * /txn-by-material/list:
 *  get:
 *     tags:
 *     - Stock Ledger
 *     summary: Returns quantity, rate & tax by material 
 *     description: /txn-by-material/list?projectId=UUID&storeId=UUID&materialId=UUID
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
 *      - name: materialId
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

// Swager API doc for /transaction-material/list and controller function getAllTxnMaterial
/**
 * @swagger
 * /transaction-material/list:
 *  get:
 *     tags:
 *     - Stock Ledger
 *     summary: Returns all transaction material
 *     description: /transaction-material/list?projectId=UUID&storeId=UUID
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

// Swager API doc for /store-location-transaction/list and controller function getAllStoreLocationTransactionData
/**
 * @swagger
 * /store-location-transaction/list:
 *  get:
 *     tags:
 *     - Stock Ledger
 *     summary: Returns total quantity group by store location with transaction list
 *     description: /store-location-transaction/list?projectId=UUID&storeId=UUID&materialId=UUID&storeLocationId=UUID&installerId=UUID&sort=createdAt&sort=DESC
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
 *      - name: materialId
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
 *      - name: installerId
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

// Swager API doc for /txn-by-location-material/list and controller function getTxnsByLocationAndMaterial
/**
 * @swagger
 * /txn-by-location-material/list:
 *  get:
 *     tags:
 *     - Stock Ledger
 *     summary: Returns total quantity group by store location with transaction list
 *     description: /txn-by-location-material/list?projectId=UUID&storeId=UUID&materialId=UUID&storeLocationId=UUID&installerId=UUID
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
 *        required: true
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

// Swager API doc for /installer-transaction/list and controller function getInstallerStockInStoreLocationWithTransaction
/**
 * @swagger
 * /installer-transaction/list:
 *  get:
 *     tags:
 *     - Stock Ledger
 *     summary: Returns installer stock in a store location with transactions
 *     description: /installer-transaction/list?projectId=UUID&storeId=UUID&storeLocationId=UUID&materialId=UUID&installerId=UUID&sort=createdAt&sort=DESC
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
 *      - name: storeLocationId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: materialId
 *        in: query
 *        required: true
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: installerId
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

// Swager API doc for /store-quantity/list and controller function getQuantityInStore
/**
 * @swagger
 * /store-quantity/list:
 *  get:
 *     tags:
 *     - Stock Ledger
 *     summary: Returns quantiy in store
 *     description: /store-quantity/list?projectId=UUID&storeId=UUID&isRestricted=IS_RESTRICTED&materialId=UUID&sort=createdAt&sort=DESC
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
 *      - name: isRestricted
 *        in: query
 *        schema:
 *          type: boolean
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

// Swager API doc for /cti-transaction/create and controller function createCtiTransaction
/**
 * @swagger
 * /cti-transaction/create:
 *  post:
 *     tags:
 *     - Stock Ledger
 *     summary: Create new CTI (Contractor To Installer) transaction
 *     description: Create CTI (Contractor To Installer) transaction
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
 *              remarks:
 *                type: string
 *              stock_ledgers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     organizationId:
 *                       type: string
 *                       format: uuid
 *                     projectId:
 *                       type: string
 *                       format: uuid
 *                     fromStoreLocationId:
 *                       type: string
 *                       format: uuid
 *                     storeId:
 *                       type: string
 *                       format: uuid
 *                     storeLocationId:
 *                       type: string
 *                       format: uuid
 *                     installerId:
 *                       type: string
 *                       format: uuid
 *                     materialId:
 *                       type: string
 *                       format: uuid
 *                     uomId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
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
 *                     serialNumber:
 *                       type: array
 *                       items:
 *                         type: string
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

// Swager API doc for /iti-transaction/create and controller function createItiTransaction
/**
 * @swagger
 * /iti-transaction/create:
 *  post:
 *     tags:
 *     - Stock Ledger
 *     summary: Create new ITI (Installer To Another Installer) transaction
 *     description: Create ITI (Installer To Another Installer) transaction
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
 *              fromInstallerId:
 *                type: string
 *                format: uuid
 *              toInstallerId:
 *                type: string
 *                format: uuid
 *              stock_ledgers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     organizationId:
 *                       type: string
 *                       format: uuid
 *                     projectId:
 *                       type: string
 *                       format: uuid
 *                     fromStoreLocationId:
 *                       type: string
 *                       format: uuid
 *                     storeId:
 *                       type: string
 *                       format: uuid
 *                     storeLocationId:
 *                       type: string
 *                       format: uuid
 *                     materialId:
 *                       type: string
 *                       format: uuid
 *                     uomId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
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
 *                     serialNumber:
 *                       type: array
 *                       items:
 *                         type: string
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

// Swager API doc for /active-serial-number/list and controller function getActiveSerialNumbersInStore
/**
 * @swagger
 * /active-serial-number/list:
 *  get:
 *     tags:
 *     - Stock Ledger
 *     summary: Returns all active material serial numbers
 *     description: /active-serial-number/list?projectId=UUID&storeId=UUID&storeLocationId=UUID&materialId=UUID&installerId=UUID&sort=serialNumber&sort=ASC&rowPerPage=10&pageNumber=1
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
 *      - name: sort
 *        in: query
 *        schema:
 *          type : array
 *          items:
 *            type: string
 *          example: ["serialNumber", "ASC"]
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

// Swager API doc for /serial-number/list and controller function getSerialNumbers
/**
 * @swagger
 * /serial-number/list:
 *  get:
 *     tags:
 *     - Stock Ledger
 *     summary: Returns all serial numbers
 *     description: /serial-number/list?projectId=UUID&storeId=UUID&storeLocationId=UUID&materialId=UUID&installerId=UUID&stockLedgerId=UUID&status=STATUS&sort=serialNumber&sort=ASC&rowPerPage=10&pageNumber=1
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
 *        required: true
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: installerId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: stockLedgerId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: status
 *        in: query
 *        schema:
 *          type: string
 *          enum: ["0", "1"]
 *      - name: sort
 *        in: query
 *        schema:
 *          type : array
 *          items:
 *            type: string
 *          example: ["serialNumber", "ASC"]
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

// Swager API doc for /serial-number-exists and controller function serialNumberAlreadyExists
/**
 * @swagger
 * /serial-number-exists:
 *  post:
 *     tags:
 *     - Stock Ledger
 *     summary: Check if serial number already exist
 *     description: Check if serial number already exist
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              materialId:
 *                type: string
 *                format: uuid
 *              serialNumber:
 *                type: array
 *                items:
 *                  type: string
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

// Swager API doc for /sto-transaction/create and controller function createStoTransaction
/**
 * @swagger
 * /sto-transaction/create:
 *  post:
 *     tags:
 *     - Stock Ledger
 *     summary: Create new STO transaction
 *     description: Create STO transaction
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
 *              requestTransactionTypeId:
 *                type: string
 *                format: uuid
 *              requestNumber:
 *                type: string
 *              fromStoreId:
 *                 type: string
 *                 format: uuid
 *              invoiceDate:
 *                type: string
 *                format: date
 *              challanNumber:
 *                type: string
 *              challanDate:
 *                type: string
 *                format: date
 *              transporterName:
 *                type: string
 *              transporterContactNumber:
 *                type: string
 *              vehicleNumber:
 *                type: string
 *              lrNumber:
 *                type: string
 *              remarks:
 *                type: string
 *              attachments:
 *                type: array
 *                items:
 *                  type: string
 *              stock_ledgers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     organizationId:
 *                       type: string
 *                       format: uuid
 *                     projectId:
 *                       type: string
 *                       format: uuid
 *                     requestNumber:
 *                       type: string
 *                     fromStoreLocationId:
 *                       type: string
 *                       format: uuid
 *                     storeId:
 *                       type: string
 *                       format: uuid
 *                     storeLocationId:
 *                       type: string
 *                       format: uuid
 *                     materialId:
 *                       type: string
 *                       format: uuid
 *                     uomId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
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
 *                     serialNumber:
 *                       type: array
 *                       items:
 *                         type: string
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

// Swager API doc for /sto-request/details and controller function getStoRequestDetails
/**
 * @swagger
 * /sto-request/details:
 *  get:
 *     tags:
 *     - Stock Ledger
 *     summary: Returns sto details based on STO Number
 *     description: /sto-request/details?transactionTypeId=UUID&referenceDocumentNumber=DOC_NUMBER&sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
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

// Swager API doc for /sto-grn-transaction/create and controller function createStoGrnTransaction
/**
 * @swagger
 * /sto-grn-transaction/create:
 *  post:
 *     tags:
 *     - Stock Ledger
 *     summary: Create new STO GRN transaction
 *     description: Create STO GRN transaction
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
 *              stoIds:
 *                type: array
 *                items:
 *                  type: string
 *                  format: uuid
 *              fromStoreId:
 *                type: string
 *                format: uuid
 *              requestNumber:
 *                type: string
 *              invoiceNumber:
 *                type: string
 *              invoiceDate:
 *                type: string
 *                format: date
 *              transporterName:
 *                type: string
 *              transporterContactNumber:
 *                type: string
 *              vehicleNumber:
 *                type: string
 *              lrNumber:
 *                type: string
 *              eWayBillNumber:
 *                type: string
 *              eWayBillDate:
 *                type: string
 *                format: date
 *              actualReceiptDate:
 *                type: string
 *                format: date
 *              remarks:
 *                type: string
 *              stock_ledgers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     organizationId:
 *                       type: string
 *                       format: uuid
 *                     projectId:
 *                       type: string
 *                       format: uuid
 *                     requestNumber:
 *                       type: string
 *                     storeId:
 *                       type: string
 *                       format: uuid
 *                     storeLocationId:
 *                       type: string
 *                       format: uuid
 *                     materialId:
 *                       type: string
 *                       format: uuid
 *                     uomId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
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
 *                     serialNumber:
 *                       type: array
 *                       items:
 *                         type: string
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

// Swager API doc for /stc-transaction/create and controller function createStcTransaction
/**
 * @swagger
 * /stc-transaction/create:
 *  post:
 *     tags:
 *     - Stock Ledger
 *     summary: Create new STC(Project Site Store to Customer) Transaction
 *     description: Create new STC(Project Site Store to Customer) Transaction
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
 *              fromOrganizationId:
 *                type: string
 *                format: uuid
 *              fromStoreId:
 *                 type: string
 *                 format: uuid
 *              eWayBillNumber:
 *                type: string
 *              eWayBillDate:
 *                type: string
 *                format: date
 *              transporterName:
 *                type: string
 *              transporterContactNumber:
 *                type: string
 *              vehicleNumber:
 *                type: string
 *              lrNumber:
 *                type: string
 *              remarks:
 *                type: string
 *              attachments:
 *                type: array
 *                items:
 *                  type: string
 *              willReturn:
 *                type: boolean
 *              requestNumber:
 *                type: string
 *              stockLedgerIds:
 *                type: array
 *                items:
 *                  type: string
 *                  format: uuid
 *              stock_ledgers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     organizationId:
 *                       type: string
 *                       format: uuid
 *                     projectId:
 *                       type: string
 *                       format: uuid
 *                     fromStoreLocationId:
 *                       type: string
 *                       format: uuid
 *                     storeId:
 *                       type: string
 *                       format: uuid
 *                     storeLocationId:
 *                       type: string
 *                       format: uuid
 *                     materialId:
 *                       type: string
 *                       format: uuid
 *                     uomId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
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
 *                     serialNumber:
 *                       type: array
 *                       items:
 *                         type: string
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

// Swager API doc for /ptp-transaction/create and controller function createPtpTransaction
/**
 * @swagger
 * /ptp-transaction/create:
 *  post:
 *     tags:
 *     - Stock Ledger
 *     summary: Create new PTP (Project to Project) transaction
 *     description: Create PTP (Project to Project) transaction
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
 *              remarks:
 *                type: string
 *              stock_ledgers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     organizationId:
 *                       type: string
 *                       format: uuid
 *                     projectId:
 *                       type: string
 *                       format: uuid
 *                     otherProjectId:
 *                       type: string
 *                       format: uuid
 *                     storeId:
 *                       type: string
 *                       format: uuid
 *                     otherStoreId:
 *                       type: string
 *                       format: uuid
 *                     storeLocationId:
 *                       type: string
 *                       format: uuid
 *                     materialId:
 *                       type: string
 *                       format: uuid
 *                     uomId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
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
 *                     serialNumber:
 *                       type: array
 *                       items:
 *                         type: string
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

// Swager API doc for /ptp-grn-transaction/create and controller function createPtpGrnTransaction
/**
 * @swagger
 * /ptp-grn-transaction/create:
 *  post:
 *     tags:
 *     - Stock Ledger
 *     summary: Create new PTP GRN transaction
 *     description: Create PTP GRN transaction
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
 *              requestIds:
 *                type: array
 *                items:
 *                  type: string
 *                  format: uuid
 *              remarks:
 *                type: string
 *              stock_ledgers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     requestNumber:
 *                       type: string
 *                     organizationId:
 *                       type: string
 *                       format: uuid
 *                     projectId:
 *                       type: string
 *                       format: uuid
 *                     otherProjectId:
 *                       type: string
 *                       format: uuid
 *                     storeId:
 *                       type: string
 *                       format: uuid
 *                     otherStoreId:
 *                       type: string
 *                       format: uuid
 *                     storeLocationId:
 *                       type: string
 *                       format: uuid
 *                     otherStoreLocationId:
 *                       type: string
 *                       format: uuid
 *                     materialId:
 *                       type: string
 *                       format: uuid
 *                     uomId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
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
 *                     serialNumber:
 *                       type: array
 *                       items:
 *                         type: string
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

// Swager API doc for /sltsl-transaction/create and controller function createSltslTransaction
/**
 * @swagger
 * /sltsl-transaction/create:
 *  post:
 *     tags:
 *     - Stock Ledger
 *     summary: Create new SLTSL (Store Location to Another Store Location) transaction
 *     description: Create SLTSL (Store Location to Another Store Location) transaction
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
 *              challanNumber:
 *                type: string
 *              challanDate:
 *                type: string
 *                format: date
 *              remarks:
 *                type: string
 *              attachments:
 *                type: array
 *                items:
 *                  type: string
 *              requestNumber:
 *                type: string
 *              stockLedgerIds:
 *                type: array
 *                items:
 *                  type: string
 *                  format: uuid
 *              stock_ledgers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     organizationId:
 *                       type: string
 *                       format: uuid
 *                     projectId:
 *                       type: string
 *                       format: uuid
 *                     fromStoreLocationId:
 *                       type: string
 *                       format: uuid
 *                     storeId:
 *                       type: string
 *                       format: uuid
 *                     storeLocationId:
 *                       type: string
 *                       format: uuid
 *                     materialId:
 *                       type: string
 *                       format: uuid
 *                     uomId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
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
 *                     serialNumber:
 *                       type: array
 *                       items:
 *                         type: string
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

// Swager API doc for /mrn-transaction/create and controller function createMrnTransaction
/**
 * @swagger
 * /mrn-transaction/create:
 *  post:
 *     tags:
 *     - Stock Ledger
 *     summary: Create new MRN (Material Return Note) transaction
 *     description: Create MRN (Material Return Note) transaction
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
 *              requestIds:
 *                type: array
 *                items:
 *                  type: string
 *                  format: uuid
 *              requestNumber:
 *                type: string
 *              fromOrganizationId:
 *                type: string
 *                format: uuid
 *              fromStoreId:
 *                type: string
 *                format: uuid
 *              placeOfSupply:
 *                type: string
 *              eWayBillNumber:
 *                type: string
 *              eWayBillDate:
 *                type: string
 *                format: date
 *              vehicleNumber:
 *                type: string
 *              remarks:
 *                type: string
 *              stock_ledgers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     organizationId:
 *                       type: string
 *                       format: uuid
 *                     projectId:
 *                       type: string
 *                       format: uuid
 *                     requestNumber:
 *                       type: string
 *                     storeId:
 *                       type: string
 *                       format: uuid
 *                     storeLocationId:
 *                       type: string
 *                       format: uuid
 *                     fromStoreLocationId:
 *                       type: string
 *                       format: uuid
 *                     materialId:
 *                       type: string
 *                       format: uuid
 *                     uomId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
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
 *                     serialNumber:
 *                       type: array
 *                       items:
 *                         type: string
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

// Swager API doc for /returnmrn-transaction/create and controller function createReturnMrnTransaction
/**
 * @swagger
 * /returnmrn-transaction/create:
 *  post:
 *     tags:
 *     - Stock Ledger
 *     summary: Create new RETURNMRN (Return Material Return Note) transaction
 *     description: Create RETURNMRN (Return Material Return Note) transaction
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
 *              mrnIds:
 *                type: array
 *                items:
 *                  type: string
 *                  format: uuid
 *              requestNumber:
 *                type: string
 *              fromStoreId:
 *                type: string
 *                format: uuid
 *              placeOfSupply:
 *                type: string
 *              eWayBillNumber:
 *                type: string
 *              eWayBillDate:
 *                type: string
 *                format: date
 *              vehicleNumber:
 *                type: string
 *              remarks:
 *                type: string
 *              stock_ledgers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     organizationId:
 *                       type: string
 *                       format: uuid
 *                     projectId:
 *                       type: string
 *                       format: uuid
 *                     requestNumber:
 *                       type: string
 *                     storeId:
 *                       type: string
 *                       format: uuid
 *                     storeLocationId:
 *                       type: string
 *                       format: uuid
 *                     fromStoreLocationId:
 *                       type: string
 *                       format: uuid
 *                     materialId:
 *                       type: string
 *                       format: uuid
 *                     uomId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
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
 *                     serialNumber:
 *                       type: array
 *                       items:
 *                         type: string
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

// Swager API doc for /stsrc-transaction/create and controller function createStsrcTransaction
/**
 * @swagger
 * /stsrc-transaction/create:
 *  post:
 *     tags:
 *     - Stock Ledger
 *     summary: Create new STSRC(Project Site Store to Supplier Repair Center) Transaction
 *     description: Create STSRC(Project Site Store to Supplier Repair Center) Transaction
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
 *              fromOrganizationId:
 *                type: string
 *                format: uuid
 *              fromStoreId:
 *                 type: string
 *                 format: uuid
 *              fromStoreLocationId:
 *                 type: string
 *                 format: uuid
 *              challanNumber:
 *                type: string
 *              challanDate:
 *                type: string
 *                format: date
 *              remarks:
 *                type: string
 *              attachments:
 *                type: array
 *                items:
 *                  type: string
 *              stock_ledgers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     organizationId:
 *                       type: string
 *                       format: uuid
 *                     projectId:
 *                       type: string
 *                       format: uuid
 *                     storeId:
 *                       type: string
 *                       format: uuid
 *                     storeLocationId:
 *                       type: string
 *                       format: uuid
 *                     materialId:
 *                       type: string
 *                       format: uuid
 *                     uomId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
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
 *                     serialNumber:
 *                       type: array
 *                       items:
 *                         type: string
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

// Swager API doc for /srcts-transaction/create and controller function createSrctsTransaction
/**
 * @swagger
 * /srcts-transaction/create:
 *  post:
 *     tags:
 *     - Stock Ledger
 *     summary: Create new SRCTS(Supplier Repair Center to Project Site Store) Transaction
 *     description: Add the "status" key inside "material_serial_numbers" only for scrap serialised materials and remove otherwise.
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
 *              requestNumber:
 *                type: string
 *              remarks:
 *                type: string
 *              stock_ledgers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     organizationId:
 *                       type: string
 *                       format: uuid
 *                     projectId:
 *                       type: string
 *                       format: uuid
 *                     requestNumber:
 *                       type: string
 *                     storeId:
 *                       type: string
 *                       format: uuid
 *                     storeLocationId:
 *                       type: string
 *                       format: uuid
 *                     materialId:
 *                       type: string
 *                       format: uuid
 *                     uomId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
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
 *                     serialNumber:
 *                       type: array
 *                       items:
 *                         type: string
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

// Swager API doc for /e-way-bill/update/:id and controller function updateEWayBill
/**
 * @swagger
 * /e-way-bill/update/{id}:
 *  put:
 *     tags:
 *     - Stock Ledger
 *     summary: Update E Way Bill Number & Date
 *     description: Update E Way Bill Number & Date
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type : string
 *          format: uuid
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              eWayBillNumber:
 *                type: string
 *              eWayBillDate:
 *                type: string
 *                format: date
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

// Swager API doc for /installation-check and controller function checkForInstallation
/**
 * @swagger
 * /installation-check:
 *  post:
 *     tags:
 *     - Stock Ledger
 *     summary: Check details required for INSTALLATION
 *     description: Check details required for INSTALLATION
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
 *              installerOrgId:
 *                type: string
 *                format: uuid
 *              installerStoreId:
 *                type: string
 *                format: uuid
 *              materialId:
 *                type: string
 *                format: uuid
 *              serialNumber:
 *                type: array
 *                items:
 *                  type: string
 *              isCompany:
 *                  type: boolean
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

// Swager API doc for /installed-serial-number and controller function getInstalledSerialNumber
/**
 * @swagger
 * /installed-serial-number:
 *  post:
 *     tags:
 *     - Stock Ledger
 *     summary: Get installed serial number
 *     description: Get installed serial number
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              transactionIdArr:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    stockLedgerId:
 *                      type: string
 *                      format: uuid
 *                    transaction:
 *                      type: string
 *                      enum: 
 *                        - credit
 *                        - debit
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

// Swager API doc for /consumption-transaction/create and controller function consumptionTransaction
/**
 * @swagger
 * /consumption-transaction/create:
 *  post:
 *     tags:
 *     - Stock Ledger
 *     summary: Create new Consumption Transaction
 *     description: Create Consumption Transaction
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
 *              requestNumber:
 *                type: string
 *              toTransactionTypeId:
 *                type: string
 *                format: uuid
 *              toOrganizationId:
 *                type: string
 *                format: uuid
 *              toStoreId:
 *                type: string
 *                format: uuid
 *              toStoreLocationId:
 *                type: string
 *                format: uuid
 *              remarks:
 *                type: string
 *              stock_ledgers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     projectId:
 *                       type: string
 *                       format: uuid
 *                     organizationId:
 *                       type: string
 *                       format: uuid
 *                     storeId:
 *                       type: string
 *                       format: uuid
 *                     storeLocationId:
 *                       type: string
 *                       format: uuid
 *                     materialId:
 *                       type: string
 *                       format: uuid
 *                     uomId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
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
 *                     serialNumber:
 *                       type: array
 *                       items:
 *                         type: string
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

// Swager API doc for /store-locations-stock and controller function getAllLocationsStockInStore
/**
 * @swagger
 * /store-locations-stock:
 *  get:
 *     tags:
 *     - Stock Ledger
 *     summary: Returns locations stock in store
 *     description: /store-locations-stock?projectId=UUID&storeId=UUID&storeLocationId=UUID&installerId=UUID&materialId=UUID&supplierId=UUID&sort=updatedAt&sort=DESC
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
 *      - name: installerId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: materialId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: supplierId
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