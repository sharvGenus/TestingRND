// Swager API doc for /approver/create and controller function createApprover
/**
 * @swagger
 * /approver/create:
 *  post:
 *     tags:
 *     - Approver
 *     summary: Create a new approver
 *     description: Create a new approver
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
 *              approvers:
 *                type: array
 *                items: 
 *                  type: object
 *                  properties:
 *                    userId:
 *                      type: string
 *                      format: uuid
 *                    organizationNameId:
 *                      type: string
 *                      format: uuid
 *                    organizationTypeId:
 *                      type: string
 *                      format: uuid
 *                    effectiveFrom:
 *                      type: string
 *                      format: date
 *                    effectiveTo:
 *                      type: string
 *                      format: date
 *                    integrationId:
 *                      type: string
 *                    email:
 *                      type: string
 *                    mobileNumber:
 *                      type: string
 *                    rank:
 *                      type: integer
 *                      default: 1
 *                    remarks:
 *                      type: string

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

// Swager API doc for /approver/update/:id and controller function updateApprover
/**
 * @swagger
 * /approver/update/{id}:
 *  put:
 *     tags:
 *     - Approver
 *     summary: Update a approver by id  
 *     description: Update a approver by id
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
 *              transactionTypeId:
 *                type: string
 *                format: uuid
 *              projectId:
 *                type: string
 *                format: uuid
 *              userId:
 *                type: string
 *                format: uuid
 *              organizationNameId:
 *                type: string
 *                format: uuid
 *              organizationTypeId:
 *                type: string
 *                format: uuid
 *              effectiveFrom:
 *                type: string
 *                format: date
 *              effectiveTo:
 *                type: string
 *                format: date
 *              integrationId:
 *                type: string
 *              email:
 *                type: string
 *              mobileNumber:
 *                type: string
 *              rank:
 *                type: integer
 *                default: 1
 *              remarks:
 *                type: string
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

// Swager API doc for /approver/list/:projectId/:transactionTypeId and controller function getAllApproversByCondition
/**
 * @swagger
 * /approver/list/{projectId}/{transactionTypeId}:
 *  get:
 *     tags:
 *     - Approver
 *     summary: Returns a approver by projectId and transactionTypeId 
 *     description: Returns a approver by projectId and transactionTypeId 
 *     parameters:
 *      - name: projectId
 *        in: path
 *        required: true
 *        schema:
 *          type : string
 *      - name: transactionTypeId
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

// Swager API doc for /approver/list and controller function getAllApprovers
/**
 * @swagger
 * /approver/list:
 *  get:
 *     tags:
 *     - Approver
 *     summary: Returns all approver  
 *     description: /approver/list?sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
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

// Swager API doc for /approver/delete/:id and controller function deleteApprover
/**
 * @swagger
 * /approver/delete/{id}:
 *  delete:
 *     tags:
 *     - Approver
 *     summary: Delete a approver by id  
 *     description: Delete a approver by id
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

/**
 * @swagger
 * /approver/update:
 *  put:
 *     tags:
 *     - Approver
 *     summary: Update aapprovers
 *     description: Update Approvers
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
 *              approvers:
 *                type: array
 *                items: 
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                      format: uuid
 *                    userId:
 *                      type: string
 *                      format: uuid
 *                    organizationNameId:
 *                      type: string
 *                      format: uuid
 *                    organizationTypeId:
 *                      type: string
 *                      format: uuid
 *                    effectiveFrom:
 *                      type: string
 *                      format: date
 *                    effectiveTo:
 *                      type: string
 *                      format: date
 *                    integrationId:
 *                      type: string
 *                    email:
 *                      type: string
 *                    mobileNumber:
 *                      type: string
 *                    rank:
 *                      type: integer
 *                      default: 1
 *                    remarks:
 *                      type: string

 *     responses:
 *      200:
 *        description: Updated
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Forbidden
 *      409:
 *        description: Duplicate
 *      500:
 *        description: Internal Error
 */
