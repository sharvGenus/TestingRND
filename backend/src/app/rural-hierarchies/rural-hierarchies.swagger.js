// Swager API doc for /rural-hierarchies/create and controller function createRuralHierarchy
/**
 * @swagger
 * /rural-hierarchies/create:
 *  post:
 *     tags:
 *     - Rural Hierarchy
 *     summary: Create a new Rural Hierarchy
 *     description: Create a new Rural Hierarchy
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
 *              status:
 *                 type: string
 *                 enum: [0, 1]
 *                 default: 1
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

// Swager API doc for /rural-hierarchies/update/:id and controller function updateRuralHierarchy
/**
 * @swagger
 * /rural-hierarchies/update/{id}:
 *  put:
 *     tags:
 *     - Rural Hierarchy
 *     summary: Update a Rural Hierarchy by id  
 *     description: Update a Rural Hierarchy by id
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
 *              status:
 *                 type: string
 *                 enum: [0, 1]
 *                 default: 1
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

// Swager API doc for /rural-hierarchies/details/:id and controller function getRuralHierarchyDetails
/**
 * @swagger
 * /rural-hierarchies/details/{id}:
 *  get:
 *     tags:
 *     - Rural Hierarchy
 *     summary: Returns a Rural Hierarchy by id  
 *     description: Returns a Rural Hierarchy by id
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

// Swager API doc for /rural-hierarchies/list and controller function getAllRuralHierarchy
/**
 * @swagger
 * /rural-hierarchies/list:
 *  get:
 *     tags:
 *     - Rural Hierarchy
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

// Swager API doc for /rural-hierarchies/delete/:id and controller function deleteRuralHierarchy
/**
 * @swagger
 * /rural-hierarchies/delete/{id}:
 *  delete:
 *     tags:
 *     - Rural Hierarchy
 *     summary: Delete a Rural Hierarchy by id  
 *     description: Delete a Rural Hierarchy by id
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
// Swager API doc for /rural-hierarchies/details/:id and controller function getRuralHierarchyDetails
/**
 * @swagger
 * /rural-hierarchies/project/{id}:
 *  get:
 *     tags:
 *     - Rural Hierarchy
 *     summary: Returns a Rural Hierarchy name and id list by projectId 
 *     description: Returns a Rural Hierarchy name and id list by projectId
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