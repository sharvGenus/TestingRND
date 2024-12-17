// Swager API doc for /daily-execution-plan/list and controller function getDailyExecutionPlanList
/**
 * @swagger
 * /daily-execution-plan/list:
 *  get:
 *     tags:
 *     - Daily Execution Plan
 *     summary: Returns daily execution plan list 
 *     description: /daily-execution-plan/list?projectId=UUID&materialTypeId=UUID&month=5&year=2024&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: projectId
 *        in: query
 *        required: true
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: materialTypeId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: month
 *        in: query
 *        schema:
 *          type : integer
 *          minimum: 1
 *          maximum: 12
 *      - name: year
 *        in: query
 *        schema:
 *          type : integer
 *          minimum: 1900
 *          maximum: 2100
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

// Swager API doc for /daily-execution-plan/delete/:id and controller function deleteDailyExecutionPlan
/**
 * @swagger
 * /daily-execution-plan/delete/{id}:
 *  delete:
 *     tags:
 *     - Daily Execution Plan
 *     summary: Delete daily execution plan by id
 *     description: Delete daily execution plan by id
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

// Swager API doc for /daily-execution-plan/history/:recordId and controller function getDailyExecutionPlanHistory
/**
 * @swagger
 * /daily-execution-plan/history/{recordId}:
 *  get:
 *     tags:
 *     - Daily Execution Plan
 *     summary: Get daily execution plan history by recordId
 *     description: /daily-execution-plan/history/{recordId}?sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
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