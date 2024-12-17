// Swager API doc for /network-hierarchies/create and controller function createNetworkHierarchy
/**
 * @swagger
 * /network-hierarchies/create:
 *  post:
 *     tags:
 *     - Network Hierarchy
 *     summary: Create a new Network Hierarchy
 *     description: Create a new Network Hierarchy
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

// Swager API doc for /network-hierarchies/update/:id and controller function updateNetworkHierarchy
/**
 * @swagger
 * /network-hierarchies/update/{id}:
 *  put:
 *     tags:
 *     - Network Hierarchy
 *     summary: Update a Network Hierarchy by id  
 *     description: Update a Network Hierarchy by id
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

// Swager API doc for /network-hierarchies/details/:id and controller function getNetworkHierarchyDetails
/**
 * @swagger
 * /network-hierarchies/details/{id}:
 *  get:
 *     tags:
 *     - Network Hierarchy
 *     summary: Returns a Network Hierarchy by id  
 *     description: Returns a Network Hierarchy by id
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

// Swager API doc for /network-hierarchies/list and controller function getAllNetworkHierarchy
/**
 * @swagger
 * /network-hierarchies/list:
 *  get:
 *     tags:
 *     - Network Hierarchy
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

// Swager API doc for /network-hierarchies/delete/:id and controller function deleteNetworkHierarchy
/**
 * @swagger
 * /network-hierarchies/delete/{id}:
 *  delete:
 *     tags:
 *     - Network Hierarchy
 *     summary: Delete a Network Hierarchy by id  
 *     description: Delete a Network Hierarchy by id
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
// Swager API doc for /network-hierarchies/details/:id and controller function getNetworkHierarchyDetails
/**
 * @swagger
 * /network-hierarchies/project/{id}:
 *  get:
 *     tags:
 *     - Network Hierarchy
 *     summary: Returns a Network Hierarchy name and id list by projectId 
 *     description: Returns a Network Hierarchy name and id list by projectId
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