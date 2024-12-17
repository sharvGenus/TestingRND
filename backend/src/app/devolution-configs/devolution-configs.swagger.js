// Swager API doc for /devolution-config/create and controller function createDevolutionConfig
/**
 * @swagger
 * /devolution-config/create:
 *  post:
 *     tags:
 *     - Devolution Configurator
 *     summary: Create devolution config
 *     description: Create devolution config
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              projectId:
 *                 type: string
 *                 format: uuid
 *              formId:
 *                 type: string
 *                 format: uuid
 *              prefix:
 *                 type: string
 *              index:
 *                 type: integer
 *                 minimum: 1
 *                 default: 1
 *              oldSerialNoId:
 *                 type: string
 *                 format: uuid
 *              oldMakeId:
 *                 type: string
 *                 format: uuid
 *              newSerialNoId:
 *                 type: string
 *                 format: uuid
 *              newMakeId:
 *                 type: string
 *                 format: uuid
 *              devolution_mappings:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     formAttributeId:
 *                       type: string
 *                       format: uuid
 *                     newName:
 *                       type: string
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

// Swager API doc for /devolution-mapping/create and controller function createDevolutionMapping
/**
 * @swagger
 * /devolution-mapping/create:
 *  post:
 *     tags:
 *     - Devolution Configurator
 *     summary: Create devolution mapping
 *     description: Create devolution mapping
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              devolutionConfigId:
 *                 type: string
 *                 format: uuid
 *              formAttributeId:
 *                 type: string
 *                 format: uuid
 *              newName:
 *                type: string
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

// Swager API doc for /devolution-config/list and controller function getDevolutionConfigList
/**
 * @swagger
 * /devolution-config/list:
 *  get:
 *     tags:
 *     - Devolution Configurator
 *     summary: Returns devolution config list
 *     description: /devolution-config/list?projectId=UUID&formId=UUID&sort=updatedAt&sort=DESC&rowPerPage=25&pageNumber=1
 *     parameters:
 *      - name: projectId
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: formId
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
 *          example: ["updatedAt", "DESC"]
 *      - name: rowPerPage
 *        in: query
 *        schema:
 *          type : integer
 *        example: 25
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

// Swager API doc for /devolution-mapping/list and controller function getDevolutionMappingList
/**
 * @swagger
 * /devolution-mapping/list:
 *  get:
 *     tags:
 *     - Devolution Configurator
 *     summary: Returns devolution mapping list
 *     description: /devolution-mapping/list?devolutionConfigId=UUIDsort=updatedAt&sort=DESC&rowPerPage=25&pageNumber=1
 *     parameters:
 *      - name: devolutionConfigId
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
 *          example: ["updatedAt", "DESC"]
 *      - name: rowPerPage
 *        in: query
 *        schema:
 *          type : integer
 *        example: 25
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

// Swager API doc for /devolution-config/update/:id and controller function updateDevolutionConfig
/**
 * @swagger
 * /devolution-config/update/{id}:
 *  put:
 *     tags:
 *     - Devolution Configurator
 *     summary: Update devolution config by id
 *     description: Update devolution config by id
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
 *              projectId:
 *                 type: string
 *                 format: uuid
 *              formId:
 *                 type: string
 *                 format: uuid
 *              prefix:
 *                 type: string
 *              index:
 *                 type: integer
 *                 minimum: 1
 *                 default: 1
 *              oldSerialNoId:
 *                 type: string
 *                 format: uuid
 *              oldMakeId:
 *                 type: string
 *                 format: uuid
 *              newSerialNoId:
 *                 type: string
 *                 format: uuid
 *              newMakeId:
 *                 type: string
 *                 format: uuid
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

// Swager API doc for /devolution-mapping/update/:id and controller function updateDevolutionMapping
/**
 * @swagger
 * /devolution-mapping/update/{id}:
 *  put:
 *     tags:
 *     - Devolution Configurator
 *     summary: Update devolution mapping by id
 *     description: Update devolution mapping by id
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
 *              devolutionConfigId:
 *                 type: string
 *                 format: uuid
 *              formAttributeId:
 *                 type: string
 *                 format: uuid
 *              newName:
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

// Swager API doc for /devolution-config/delete/:id and controller function deleteDevolutionConfig
/**
 * @swagger
 * /devolution-config/delete/{id}:
 *  delete:
 *     tags:
 *     - Devolution Configurator
 *     summary: Delete devolution config by id
 *     description: Delete devolution config by id
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

// Swager API doc for /devolution-mapping/delete/:id and controller function deleteDevolutionMapping
/**
 * @swagger
 * /devolution-mapping/delete/{id}:
 *  delete:
 *     tags:
 *     - Devolution Configurator
 *     summary: Delete devolution mapping by id
 *     description: Delete devolution mapping by id
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