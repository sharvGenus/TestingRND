// Swager API doc for /transaction-type-range/create and controller function createTransactionTypeRange
/**
 * @swagger
 * /transaction-type-range/create:
 *  post:
 *     tags:
 *     - Transaction Type Range
 *     summary: Create a new Transaction Type Range
 *     description: Create a new Transaction Type Range
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              organizationId:
 *                type: string
 *                format: uuid
 *              storeId:
 *                type: string
 *                format: uuid
 *              prefix:
 *                type: string
 *              ranges:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     transactionTypeIds:
 *                       type: array
 *                       items:
 *                         format: uuid
 *                     startRange:
 *                       type: integer
 *                       minimum: 1
 *                     endRange:
 *                       type: integer
 *                       minimum: 2
 *                     effectiveDate:
 *                       type: string
 *                       format: date
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

// Swager API doc for /transaction-type-range/update/:id and controller function updateTransactionTypeRange
/**
 * @swagger
 * /transaction-type-range/update/{id}:
 *  put:
 *     tags:
 *     - Transaction Type Range
 *     summary: Update a Transaction Type Range by id
 *     description: Update a Transaction Type Range by id
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
 *              organizationId:
 *                type: string
 *                format: uuid
 *              storeId:
 *                type: string
 *                format: uuid
 *              prefix:
 *                type: string
 *              name:
 *                type: string
 *              transactionTypeIds:
 *                type: array
 *                items:
 *                  format: uuid
 *              startRange:
 *                type: integer
 *                minimum: 1
 *              endRange:
 *                type: integer
 *                minimum: 2
 *              effectiveDate:
 *                type: string
 *                format: date
 *              endDate:
 *                type: string
 *                format: date
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

// Swager API doc for /transaction-type-range/activate/:id and controller function activateTransactionTypeRange
/**
 * @swagger
 * /transaction-type-range/activate/{id}:
 *  put:
 *     tags:
 *     - Transaction Type Range
 *     summary: Activate a Transaction Type Range by id
 *     description: Activate a Transaction Type Range by id
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type : string
 *          format: uuid
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

// Swager API doc for /transaction-type-range/list and controller function getTransactionTypeRangeList
/**
 * @swagger
 * /transaction-type-range/list:
 *  get:
 *     tags:
 *     - Transaction Type Range
 *     summary: Returns Transaction Type Range list 
 *     description: /transaction-type-range/list?sort=createdAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
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

// Swager API doc for /transaction-type-range/delete/:id and controller function deleteTransactionTypeRange
/**
 * @swagger
 * /transaction-type-range/delete/{id}:
 *  delete:
 *     tags:
 *     - Transaction Type Range
 *     summary: Delete a Transaction Type Range by id
 *     description: Delete a Transaction Type Range by id
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

// Swager API doc for /transaction-type-range/history/:recordId and controller function getTransactionTypeRangeHistory
/**
 * @swagger
 * /transaction-type-range/history/{recordId}:
 *  get:
 *     tags:
 *     - Transaction Type Range
 *     summary: Get Transaction Type Range history by recordId
 *     description: /transaction-type-range/history/{recordId}?sort=createdAt&sort=DESC&rowPerPage=10&pageNumber=1
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

// Swager API doc for /active-inactive-transaction-type-range/list and controller function getActiveInactiveTransactionTypeRangeList
/**
 * @swagger
 * /active-inactive-transaction-type-range/list:
 *  get:
 *     tags:
 *     - Transaction Type Range
 *     summary: Returns Transaction Type Range list 
 *     description: /active-inactive-transaction-type-range/list?organizationId=UUID&storeId=UUID&sort=createdAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
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