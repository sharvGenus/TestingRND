// Swager API doc for /gaa-hierarchies/create and controller function createGaa Hierarchy
/**
 * @swagger
 * /gaa-hierarchies/create:
 *  post:
 *     tags:
 *     - Gaa Hierarchy
 *     summary: Create a new Gaa Hierarchy
 *     description: Create a new Gaa Hierarchy
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              projectId:
 *                 type: string
 *                 format: uuid
 *              code:
 *                type: string
 *              rank:
 *                type: string
 *              isMapped:
 *                type: enum
 *                enum: [0, 1]
 *                default: 0
 *              isActive:
 *                type: string
 *                enum: [0, 1]
 *                default: 1
 *              remarks:
 *                 type: string
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

// Swager API doc for /gaa-hierarchies/update/:id and controller function updateGaa Hierarchy
/**
 * @swagger
 * /gaa-hierarchies/update/{id}:
 *  put:
 *     tags:
 *     - Gaa Hierarchy
 *     summary: Update a Gaa Hierarchy by id
 *     description: Update a Gaa Hierarchy by id
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
 *              name:
 *                type: string
 *              projectId:
 *                type: string
 *                format: uuid
 *              code:
 *                type: string
 *              rank:
 *                type: string
 *              isMapped:
 *                type: enum
 *                enum: [0, 1]
 *                default: 0
 *              isActive:
 *                type: string
 *                enum: [0, 1]
 *                default: 1
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

// Swager API doc for /gaa-hierarchies/details/:id and controller function getGaa HierarchyDetails
/**
 * @swagger
 * /gaa-hierarchies/details/{id}:
 *  get:
 *     tags:
 *     - Gaa Hierarchy
 *     summary: Returns a Gaa Hierarchy by id
 *     description: Returns a Gaa Hierarchy by id
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

// Swager API doc for /gaa-hierarchies/list and controller function getAllGaaHierarchies
/**
 * @swagger
 * /gaa-hierarchies/list:
 *  get:
 *     tags:
 *     - Gaa Hierarchy
 *     summary: Returns all firms
 *     description: Return all firms
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

// Swager API doc for /gaa-hierarchies/delete/:id and controller function deleteGaa Hierarchy
/**
 * @swagger
 * /gaa-hierarchies/delete/{id}:
 *  delete:
 *     tags:
 *     - Gaa Hierarchy
 *     summary: Delete a Gaa Hierarchy by id
 *     description: Delete a Gaa Hierarchy by id
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
// Swager API doc for /gaa-hierarchies/project/:id and controller function get Gaa Hierarchy Name and Id by Project Id
/**
 * @swagger
 * /gaa-hierarchies/project/{id}:
 *  get:
 *     tags:
 *     - Gaa Hierarchy
 *     summary: Returns a Gaa Hierarchy  Name and Id by Project Id
 *     description: Returns a Gaa Hierarchy  Name and Id by Project Id
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
 * /gaa-hierarchies/area-project-level/project/{id}:
 *  get:
 *     tags:
 *     - Gaa Hierarchy
 *     summary: Returns a Gaa Hierarchy, GAA Level Entries and network hierarchy, Network level entries details by Project Id
 *     description: Returns a Gaa Hierarchy, GAA Level Entries and network hierarchy, Network level entries details by Project Id
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
