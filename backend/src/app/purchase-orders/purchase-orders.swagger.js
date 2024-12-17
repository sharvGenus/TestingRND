// Swager API doc for /purchase-order/create and controller function createPurchaseOrder
/**
 * @swagger
 * /purchase-order/create:
 *  post:
 *     tags:
 *     - Purchase Order
 *     summary: Create new purchase order
 *     description: Create new purchase order
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              poNumber:
 *                type: string
 *              poDate:
 *                type: string
 *                format: date
 *              revisionReference:
 *                type: string
 *              revisionDate:
 *                type: string
 *                format: date
 *              plantCode:
 *                type: string
 *              organizationIntegrationId:
 *                type: string
 *              billingAddress:
 *                type: string              
 *              deliveryAddress:
 *                type: string
 *              remarks:
 *                type: string
 *              materials:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     materialIntegrationId:
 *                       type: string
 *                     longDescription:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     unitPrice:
 *                       type: number
 *                       format: float
 *                     priceUnit:
 *                       type: integer
 *                       default: 1
 *                     totalPrice:
 *                       type: number
 *                       format: float
 *                     tax:
 *                       type: number
 *                       format: float
 *                     deliverySchedule:
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

// Swager API doc for /plant-code/list and controller function getAllPlantCodes
/**
 * @swagger
 * /plant-code/list:
 *  get:
 *     tags:
 *     - Purchase Order
 *     summary: Returns plant code list
 *     description: /plant-code/list?organizationIntegrationId=ORGANIZATION_INTEGRATION_ID
 *     parameters:
 *      - name: organizationIntegrationId
 *        in: query
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

// Swager API doc for /purchase-order/list and controller function getAllPurchaseOrders
/**
 * @swagger
 * /purchase-order/list:
 *  get:
 *     tags:
 *     - Purchase Order
 *     summary: Returns all stock ledger
 *     description: /purchase-order/list?organizationIntegrationId=ORGANIZATION_INTEGRATION_ID&plantCode=PLANT_CODE&status=STATUS&sort=updatedAt&sort=DESC
 *     parameters:
 *      - name: organizationIntegrationId
 *        in: query
 *        schema:
 *          type : string
 *      - name: plantCode
 *        in: query
 *        schema:
 *          type : string
 *      - name: status
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
