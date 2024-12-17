// Swager API doc for /work-area-assignment/create and controller function createWorkAreaAssignment
/**
 * @swagger
 * /work-area-assignment/create:
 *  post:
 *     tags:
 *     - Work Area Assignment
 *     summary: Create a new Work Area Assignment
 *     description: Create a new Work Area Assignment
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: string
 *                format: uuid
 *              gaaHierarchyId:
 *                type: string
 *                format: uuid
 *              gaaLevelEntryId:
 *                type: string
 *                format: uuid
 *              networkHierarchyId:
 *                 type: sting
 *                 format: uuid
 *              networkLevelEntryId:
 *                 type: string
 *                 format: uuid
 *              dateFrom:
 *                 type: string
 *                 format: date
 *              dateTo:
 *                 type: string
 *                 format: date
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

// Swager API doc for /work-area-assignment/update/:id and controller function updateWorkAreaAssignment
/**
 * @swagger
 * /work-area-assignment/update/{id}:
 *  put:
 *     tags:
 *     - Work Area Assignment
 *     summary: Update a Work Area Assignment by id
 *     description: Update a Work Area Assignment by id
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
 *                type: string
 *                format: uuid
 *              gaaHierarchyId:
 *                type: string
 *                format: uuid
 *              gaaLevelEntryId:
 *                type: string
 *                format: uuid
 *              networkHierarchyId:
 *                 type: sting
 *                 format: uuid
 *              networkLevelEntryId:
 *                 type: string
 *                 format: uuid
 *              dateFrom:
 *                 type: string
 *                 format: date
 *              dateTo:
 *                 type: string
 *                 format: date
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

// Swager API doc for /work-area-assignment-by-userId/details/:id and controller function getWorkAreaAssignmentByUserId
/**
 * @swagger
 * /work-area-assignment-by-userId/details/{id}:
 *  get:
 *     tags:
 *     - Work Area Assignment
 *     summary: Returns a Work Area Assignment by user's id
 *     description: Returns a Work Area Assignment by user's id
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

// Swager API doc for /work-area-assignment/list and controller function getAllWorkAreaAssignment
/**
 * @swagger
 * /work-area-assignment/list:
 *  get:
 *     tags:
 *     - Work Area Assignment
 *     summary: Returns all Work Area Assignments
 *     description: Return all Work Area Assignments
 *     parameters:
 *      - name: userId
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

// Swager API doc for /work-area-assignment/delete/:id and controller function deleteWorkAreaAssignment
/**
 * @swagger
 * /work-area-assignment/delete/{id}:
 *  delete:
 *     tags:
 *     - Work Area Assignment
 *     summary: Delete a Work Area Assignment by id
 *     description: Delete a Work Area Assignment by id
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
