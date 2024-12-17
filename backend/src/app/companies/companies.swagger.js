// Swager API doc for /company/create and controller function createCompany
/**
 * @swagger
 * /company/create:
 *  post:
 *     tags:
 *     - Company
 *     summary: Create a new company
 *     description: Create a new company
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              gstNumber:
 *                 type: string
 *              email:
 *                 type: string
 *              mobileNumber:
 *                 type: string
 *              telephone:
 *                 type: string
 *              parentCompanyId:
 *                 type: string
 *                 format: uuid
 *              registeredOfficeAddress:
 *                 type: string
 *              registeredOfficeCityId:
 *                 type: string
 *                 format: uuid
 *              registeredOfficePincode:
 *                 type: string
 *              currentOfficeAddress:
 *                 type: string
 *              currentOfficeCityId:
 *                 type: string
 *                 format: uuid
 *              currentOfficePincode:
 *                 type: string
 *              attachments:
 *                 type: string
 *              integrationId:
 *                type: string
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
// Swager API doc for /company/update/:id and controller function updateCompany
/**
 * @swagger
 * /company/update/{id}:
 *  put:
 *     tags:
 *     - Company
 *     summary: Update a company by id
 *     description: Update a company by id
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
 *              code:
 *                type: string
 *              gstNumber:
 *                 type: string
 *              email:
 *                 type: string
 *              mobileNumber:
 *                 type: string
 *              telephone:
 *                 type: string
 *              parentCompanyId:
 *                 type: string
 *                 format: uuid
 *              registeredOfficeAddress:
 *                 type: string
 *              registeredOfficeCityId:
 *                 type: string
 *                 format: uuid
 *              registeredOfficePincode:
 *                 type: string
 *              currentOfficeAddress:
 *                 type: string
 *              currentOfficeCityId:
 *                 type: string
 *                 format: uuid
 *              currentOfficePincode:
 *                  type: string
 *              attachments:
 *                 type: string
 *              integrationId:
 *                type: string
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
// Swager API doc for /company/details/:id and controller function getCompanyDetails
/**
 * @swagger
 * /company/details/{id}:
 *  get:
 *     tags:
 *     - Company
 *     summary: Returns a Company by id
 *     description: Returns a Company by id
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
// Swager API doc for /company/list and controller function getAllCompanies
/**
 * @swagger
 * /company/list:
 *  get:
 *     tags:
 *     - Company
 *     summary: Returns all company
 *     description: Return all company
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
// Swager API doc for /company/delete/:id and controller function deleteCompany
/**
 * @swagger
 * /company/delete/{id}:
 *  delete:
 *     tags:
 *     - Company
 *     summary: Delete a company by id
 *     description: Delete a company by id
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
// Swager API doc for /company/dropdown and controller function getAllCompanyByDropdown
/**
 * @swagger
 * /company/dropdown:
 *  get:
 *     tags:
 *     - Company
 *     summary: get all company name and id
 *     description: get all company name and id
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
