// Swager API doc for /cancel-grn-transaction/create and controller function createCancelGrnTransaction
/**
 * @swagger
 * /cancel-grn-transaction/create:
 *  post:
 *     tags:
 *     - Cancel Transaction
 *     summary: Create new Cancel GRN(Goods Receive Note) Transaction
 *     description: Create new Cancel GRN(Goods Receive Note) Transaction
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
 *              projectId:
 *                type: string
 *                format: uuid
 *              toOrganizationId:
 *                type: string
 *                format: uuid
 *              storeId:
 *                type: string
 *                format: uuid
 *              transactionCreatedAt:
 *                type: string
 *                format: date-time
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

// Swager API doc for /cancel-min-transaction/create and controller function createCancelMinTransaction
/**
 * @swagger
 * /cancel-min-transaction/create:
 *  post:
 *     tags:
 *     - Cancel Transaction
 *     summary: Create new Cancel MIN(Material Issue Note) Transaction
 *     description: Create new Cancel MIN(Material Issue Note) Transaction
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
 *              grnTxnCreatedAt:
 *                type: string
 *                format: date-time
 *              grnLedgerIds:
 *                type: array
 *                items:
 *                  type: string
 *                  format: uuid
 *              grnLedgerDetailId:
 *                type: string
 *                format: uuid
 *              minLedgerIds:
 *                type: array
 *                items:
 *                  type: string
 *                  format: uuid
 *              minLedgerDetailId:
 *                type: string
 *                format: uuid
 *              min_stock_ledgers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     requestNumber:
 *                       type: string
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
 *                     otherStoreId:
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
 *              grn_stock_ledgers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     requestNumber:
 *                       type: string
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
 *                     otherStoreId:
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

// Swager API doc for /cancel-ltl-transaction/create and controller function createCancelLtlTransaction
/**
 * @swagger
 * /cancel-ltl-transaction/create:
 *  post:
 *     tags:
 *     - Cancel Transaction
 *     summary: Create new Cancel LTL(Location To Location) Transfer Transaction
 *     description: Create Cancel LTL(Location To Location) Transfer Transaction
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
 *              transactionCreatedAt:
 *                type: string
 *                format: date-time
 *              fromStoreLocationId:
 *                type: string
 *                format: uuid
 *              ltlLedgerDetailId:
 *                type: string
 *                format: uuid
 *              ltlIds:
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
 *                     requestNumber:
 *                       type: string
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
 *                     otherStoreId:
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

// Swager API doc for /cancel-stc-transaction/create and controller function createCancelUtilityTransaction
/**
 * @swagger
 * /cancel-stc-transaction/create:
 *  post:
 *     tags:
 *     - Cancel Transaction
 *     summary: Create new Cancel STC(Customer To Project Site Store) Transfer Transaction
 *     description: Create Cancel STC(Customer To Project Site Store) Transfer Transaction
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
 *              transactionCreatedAt:
 *                type: string
 *                format: date-time
 *              stcLedgerDetailId:
 *                type: string
 *                format: uuid
 *              stcIds:
 *                type: array
 *                items:
 *                  type: string
 *                  format: uuid
 *              debit_stock_ledgers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     requestNumber:
 *                       type: string
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
 *                     otherStoreId:
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
 *              credit_stock_ledgers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     requestNumber:
 *                       type: string
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
 *                     otherStoreId:
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

// Swager API doc for /cancel-sto-transaction/create and controller function createCancelStoTransaction
/**
 * @swagger
 * /cancel-sto-transaction/create:
 *  post:
 *     tags:
 *     - Cancel Transaction
 *     summary: Create new Cancel STO(project site store to another project site store) Transfer Transaction
 *     description: Create Cancel STO(project site store to another project site store) Transfer Transaction
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
 *              stoLedgerDetailId:
 *                type: string
 *                format: uuid
 *              stoIds:
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
 *                     requestNumber:
 *                       type: string
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
 *                     otherStoreId:
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

// Swager API doc for /cancel-sto-grn-transaction/create and controller function createCancelStoGrnTransaction
/**
 * @swagger
 * /cancel-sto-grn-transaction/create:
 *  post:
 *     tags:
 *     - Cancel Transaction
 *     summary: Create new Cancel STO GRN Transaction
 *     description: Create Cancel STO GRN Transaction
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
 *              transactionCreatedAt:
 *                type: string
 *                format: date-time
 *              stoGrnLedgerDetailId:
 *                type: string
 *                format: uuid
 *              stoGrnIds:
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
 *                     requestNumber:
 *                       type: string
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
 *                     otherStoreId:
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

// Swager API doc for /cancel-mrn-transaction/create and controller function createCancelMrnTransaction
/**
 * @swagger
 * /cancel-mrn-transaction/create:
 *  post:
 *     tags:
 *     - Cancel Transaction
 *     summary: Create new Cancel MRN(Material Return Note) Transaction
 *     description: Create new Cancel MRN(Material Return Note) Transaction
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
 *              mrnLedgerIds:
 *                type: array
 *                items:
 *                  type: string
 *                  format: uuid
 *              mrnLedgerDetailId:
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
 *                     requestNumber:
 *                       type: string
 *                     storeId:
 *                       type: string
 *                       format: uuid
 *                     storeLocationId:
 *                       type: string
 *                       format: uuid
 *                     otherStoreId:
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

// Swager API doc for /cancel-returnmrn-transaction/create and controller function createCancelMrnTransaction
/**
 * @swagger
 * /cancel-returnmrn-transaction/create:
 *  post:
 *     tags:
 *     - Cancel Transaction
 *     summary: Create new Cancel Return MRN(Return Material Return Note) Transaction
 *     description: Create new Cancel Return MRN(Return Material Return Note) Transaction
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
 *              returnMrnTxnCreatedAt:
 *                type: string
 *                format: date-time
 *              returnMrnIds:
 *                type: array
 *                items:
 *                  type: string
 *                  format: uuid
 *              returnMrnDetailId:
 *                type: string
 *                format: uuid
 *              mrnIds:
 *                type: array
 *                items:
 *                  type: string
 *                  format: uuid
 *              mrnDetailId:
 *                type: string
 *                format: uuid
 *              mrn_stock_ledgers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     requestNumber:
 *                       type: string
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
 *                     otherStoreId:
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
 *              returnmrn_stock_ledgers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     transactionTypeId:
 *                       type: string
 *                       format: uuid
 *                     requestNumber:
 *                       type: string
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
 *                     otherStoreId:
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