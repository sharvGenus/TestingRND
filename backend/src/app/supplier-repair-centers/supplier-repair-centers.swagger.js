// Swager API doc for /supplier-repair-centers/create and controller function create supplier-repair-centers

/**
* @swagger
* /supplier-repair-centers/create:
*  post:
*     tags:
*     - Supplier Repair Center
*     summary: Create a new supplier-repair-centers
*     description: Create a new supplier-repair-centers
*     requestBody:
*      required: true
*      content:
*        application/json:
*           schema:
*            type: object
*            properties:
*              supplierId:
*                 type: string
*                 format: uuid
*              integrationId:
*                type: string
*              name:
*                type: string
*              code:
*                type: string
*              photo:
*                type: string
*              email:
*                 type: string
*              mobileNumber:
*                 type: string
*              telephone:
*                 type: string
*              registeredOfficeAddress:
*                 type: string
*              registeredOfficeCityId:
*                 type: string
*                 format: uuid
*              registeredOfficePinCode:
*                 type: string
*              currentOfficeAddress:
*                 type: string
*              currentOfficeCityId:
*                 type: string
*                 format: uuid
*              currentOfficePinCode:
*                 type: string
*              attachments:
*                 type: string
*              remarks:
*                 type: string
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

// Swager API doc for /supplier-repair-centers/update/:id and controller function update supplier-repair-centers

/**
* @swagger
* /supplier-repair-centers/update/{id}:
*  put:
*     tags:
*     - Supplier Repair Center
*     summary: Update a supplier-repair-centers by id
*     description: Update a supplier-repair-centers by id
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
*              supplierId:
*                 type: string
*                 format: uuid
*              integrationId:
*                type: string
*              name:
*                type: string
*              code:
*                type: string
*              photo:
*                type: string
*              email:
*                 type: string
*              mobileNumber:
*                 type: string
*              telephone:
*                 type: string
*              registeredOfficeAddress:
*                 type: string
*              registeredOfficeCityId:
*                 type: string
*                 format: uuid
*              registeredOfficePinCode:
*                 type: string
*              currentOfficeAddress:
*                 type: string
*              currentOfficeCityId:
*                 type: string
*                 format: uuid
*              currentOfficePinCode:
*                 type: string
*              attachments:
*                 type: string
*              remarks:
*                 type: string
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

// Swager API doc for /supplier-repair-centers/details/:id and controller function get supplier-repair-centers

/**
* @swagger
* /supplier-repair-centers/details/{id}:
*  get:
*     tags:
*     - Supplier Repair Center
*     summary: Returns a supplier-repair-centers by id
*     description: Returns a supplier-repair-centers by id
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

// Swager API doc for /supplier-repair-centers/list and controller function getAll supplier-repair-centers

/**
* @swagger
* /supplier-repair-centers/list:
*  get:
*     tags:
*     - Supplier Repair Center
*     summary: Returns all supplier-repair-centers
*     description: Return all supplier-repair-centers
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

// Swager API doc for /supplier-repair-centers/delete/:id and controller function delete supplier-repair-centers
/**
* @swagger
* /supplier-repair-centers/delete/{id}:
*  delete:
*     tags:
*     - Supplier Repair Center
*     summary: Delete a supplier-repair-centers by id
*     description: Delete a supplier-repair-centers by id
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
