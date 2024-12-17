// Swager API doc for /urban-hierarchies/create and controller function createUrban Hierarchy
/**
 * @swagger
 * /urban-hierarchies/create:
 *  post:
 *     tags:
 *     - Urban Hierarchy
 *     summary: Create a new Urban Hierarchy
 *     description: Create a new Urban Hierarchy
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

// Swager API doc for /urban-hierarchies/update/:id and controller function updateUrban Hierarchy
/**
 * @swagger
 * /urban-hierarchies/update/{id}:
 *  put:
 *     tags:
 *     - Urban Hierarchy
 *     summary: Update a Urban Hierarchy by id
 *     description: Update a Urban Hierarchy by id
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

// Swager API doc for /urban-hierarchies/details/:id and controller function getUrban HierarchyDetails
/**
 * @swagger
 * /urban-hierarchies/details/{id}:
 *  get:
 *     tags:
 *     - Urban Hierarchy
 *     summary: Returns a Urban Hierarchy by id
 *     description: Returns a Urban Hierarchy by id
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

// Swager API doc for /urban-hierarchies/list and controller function getAllUrbanHierarchies
/**
 * @swagger
 * /urban-hierarchies/list:
 *  get:
 *     tags:
 *     - Urban Hierarchy
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

// Swager API doc for /urban-hierarchies/delete/:id and controller function deleteUrban Hierarchy
/**
 * @swagger
 * /urban-hierarchies/delete/{id}:
 *  delete:
 *     tags:
 *     - Urban Hierarchy
 *     summary: Delete a Urban Hierarchy by id
 *     description: Delete a Urban Hierarchy by id
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
// Swager API doc for /urban-hierarchies/project/:id and controller function get Urban Hierarchy Name and Id by Project Id
/**
 * @swagger
 * /urban-hierarchies/project/{id}:
 *  get:
 *     tags:
 *     - Urban Hierarchy
 *     summary: Returns a Urban Hierarchy  Name and Id by Project Id
 *     description: Returns a Urban Hierarchy  Name and Id by Project Id
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
 * /urban-hierarchies/area-project-level/project/{id}:
 *  get:
 *     tags:
 *     - Urban Hierarchy
 *     summary: Returns a Urban Hierarchy, GAA Level Entries and network hierarchy, Network level entries details by Project Id
 *     description: Returns a Urban Hierarchy, GAA Level Entries and network hierarchy, Network level entries details by Project Id
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
