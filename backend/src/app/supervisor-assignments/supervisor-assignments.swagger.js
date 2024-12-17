// Swager API doc for /supervisor-assignments/create and controller function create supervisor-assignments
/**
 * @swagger
 * /supervisor-assignments/create:
 *  post:
 *     tags:
 *     - Supervisor Assignments
 *     summary: Create a new supervisor-assignments
 *     description: Create a new supervisor-assignments
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              superVisorAssignmentArray:
 *                 type: array of objects
 *              userId:
 *                 type: string
 *                 format: uuid
 *              supervisorId:
 *                 type: string
 *                 format: uuid
 *              dateFrom:
 *                type: string
 *                format: date
 *              dateTo:
 *                type: string
 *                format: date
 *              isActive:
 *                type: integer
 *
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

// Swager API doc for /supervisor-assignments/update/:id and controller function update supervisor-assignments
/**
 * @swagger
 * /supervisor-assignments/update/{id}:
 *  put:
 *     tags:
 *     - Supervisor Assignments
 *     summary: Update a supervisor-assignments by id
 *     description: Update a supervisor-assignments by id
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
 *              userId:
 *                 type: string
 *                 format: uuid
 *              supervisorId:
 *                 type: string
 *                 format: uuid
 *              dateFrom:
 *                type: string
 *                format: date
 *              dateTo:
 *                type: string
 *                format: date
 *              isActive:
 *                type: integer
 *  responses:
 *      200:
 *        description: Updated
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Internal Error
 */

// Swager API doc for /supervisor-assignments/details/:id and controller function get supervisor-assignmentsDetails
/**
 * @swagger
 * /supervisor-assignments/details/{id}:
 *  get:
 *     tags:
 *     - Supervisor Assignments
 *     summary: Returns a supervisor-assignments by id
 *     description: Returns a supervisor-assignments by id
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

// Swager API doc for /supervisor-assignments/list and controller function getAll supervisor-assignments
/**
 * @swagger
 * /supervisor-assignments/list:
 *  get:
 *     tags:
 *     - Supervisor Assignments
 *     summary: Returns all supervisor-assignments
 *     description: Return all supervisor-assignments
 *     parameters:
 *      - name: userId
 *        in: query
 *        schema:
 *          type : string
 *      - name: supervisorId
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

// Swager API doc for /supervisor-assignments/delete/:id and controller function delete supervisor-assignments
/**
 * @swagger
 * /supervisor-assignments/delete/{id}:
 *  delete:
 *     tags:
 *     - Supervisor Assignments
 *     summary: Delete a supervisor-assignments by id
 *     description: Delete a supervisor-assignments by id
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
