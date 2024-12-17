// Swager API doc for /organization/create and controller function createOrganizationStoreLocation
/**
 * @swagger
 * /organization/create:
 *  post:
 *     tags:
 *     - Organization
 *     summary: Create a new organization
 *     description: Create a new organization
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              parentId:
 *                type: string
 *                format: uuid
 *              organizationType:
 *                type: string
 *                format: uuid
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              integrationId:
 *                type: string
 *              gstNumber:
 *                 type: string
 *              email:
 *                 type: string
 *              mobileNumber:
 *                 type: string
 *              telephone:
 *                 type: string
 *              address:
 *                 type: string
 *              registeredOfficeAddress:
 *                 type: string
 *              registeredOfficeCityId:
 *                 type: string
 *                 format: uuid
 *              cityId:
 *                 type: string
 *                 format: uuid
 *              pinCode:
 *                 type: string
 *              registeredOfficePinCode:
 *                 type: string
 *              check:
 *                 type: boolean
 *              title:
 *                 type: string
 *                 format: uuid
 *              nameOfVendor:
 *                 type: string
 *              authorisedDistributor:
 *                 type: string
 *              firmType:
 *                 type: string
 *              owner:
 *                 type: string
 *              categoryOfIndustry:
 *                 type: string
 *              nameOfContactPerson:
 *                 type: string
 *              gstStatusId:
 *                type: string
 *                format: uuid
 *              panNumber:
 *                 type: string
 *              panReference:
 *                 type: string
 *              dateOfBirth:
 *                 type: string
 *                 format: date
 *              annualTurnoverOfFirstYear:
 *                 type: integer 
 *              annualTurnoverOfSecondYear:
 *                 type: integer
 *              annualTurnoverOfThirdYear:
 *                 type: integer
 *              bankName:
 *                 type: string
 *              branchName:
 *                 type: string
 *              accountNumber:
 *                 type: integer
 *              ifscCode:
 *                 type: string
 *              paymentTermId:
 *                type: string
 *                format: uuid
 *              currencyId:
 *                type: string
 *                format: uuid
 *              incotermsId:
 *                type: string
 *                format: uuid
 *              attachments:
 *                 type: string
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

// Swager API doc for /organization/update/:id and controller function updateOrganizationStoreLocation
/**
 * @swagger
 * /organization/update/{id}:
 *  put:
 *     tags:
 *     - Organization
 *     summary: Update a organization by id  
 *     description: Update a organization by id
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
 *              parentId:
 *                type: string
 *                format: uuid
 *              organizationType:
 *                type: string
 *                format: uuid
 *              name:
 *                type: string
 *              code:
 *                type: string
 *              integrationId:
 *                type: string
 *              gstNumber:
 *                 type: string
 *              email:
 *                 type: string
 *              mobileNumber:
 *                 type: string
 *              telephone:
 *                 type: string
 *              address:
 *                 type: string
 *              registeredOfficeAddress:
 *                 type: string
 *              registeredOfficeCityId:
 *                 type: string
 *                 format: uuid
 *              cityId:
 *                 type: string
 *                 format: uuid
 *              pinCode:
 *                 type: string
 *              registeredOfficePinCode:
 *                 type: string
 *              check:
 *                 type: boolean
 *              title:
 *                 type: string
 *                 format: uuid
 *              nameOfVendor:
 *                 type: string
 *              authorisedDistributor:
 *                 type: string
 *              firmType:
 *                 type: string
 *              owner:
 *                 type: string
 *              categoryOfIndustry:
 *                 type: string
 *              nameOfContactPerson:
 *                 type: string
 *              gstStatusId:
 *                type: string
 *                format: uuid
 *              panNumber:
 *                 type: string
 *              panReference:
 *                 type: string
 *              dateOfBirth:
 *                 type: string
 *                 format: date
 *              annualTurnoverOfFirstYear:
 *                 type: integer 
 *              annualTurnoverOfSecondYear:
 *                 type: integer
 *              annualTurnoverOfThirdYear:
 *                 type: integer
 *              bankName:
 *                 type: string
 *              branchName:
 *                 type: string
 *              accountNumber:
 *                 type: integer
 *              ifscCode:
 *                 type: string
 *              paymentTermId:
 *                type: string
 *                format: uuid
 *              currencyId:
 *                type: string
 *                format: uuid
 *              incotermsId:
 *                type: string
 *                format: uuid
 *              attachments:
 *                 type: string
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

// Swager API doc for /organization/details/:id and controller function getOrganizationStoreLocationDetails
/**
 * @swagger
 * /organization/details/{id}:
 *  get:
 *     tags:
 *     - Organization
 *     summary: Returns a organization by id  
 *     description: Returns a organization by id
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

// Swager API doc for /organization/list/:organizationTypeId and controller function getAllOrganizationStoreLocations
/**
 * @swagger
 * /organization/list/{organizationTypeId}:
 *  get:
 *     tags:
 *     - Organization
 *     summary: Returns all organization  
 *     description: /organization/list/{organizationTypeId}?sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
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

// Swager API doc for /organization-location/list/:organizationTypeId and controller function getAllOrganizationLocations
/**
 * @swagger
 * /organization-location/list/{organizationTypeId}:
 *  get:
 *     tags:
 *     - Organization
 *     summary: Returns all organization locations  
 *     description: /organization-location/list/{organizationTypeId}?sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
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

// Swager API doc for /organization/delete/:id and controller function deleteOrganizationStoreLocation
/**
 * @swagger
 * /organization/delete/{id}:
 *  delete:
 *     tags:
 *     - Organization
 *     summary: Delete a organization by id  
 *     description: Delete a organization by id
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

// Swager API doc for /organization-details/:integrationId and controller function getOrganizationDetailsByIntegrationId
/**
 * @swagger
 * /organization-details/{integrationId}:
 *  get:
 *     tags:
 *     - Organization
 *     summary: Returns organization details by integration id
 *     description: Returns organization details by integration id
 *     parameters:
 *      - name: integrationId 
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

// Swager API doc for /organization-location/list/:organizationTypeId/:parentId and controller function getAllOrganizationLocationsByParentId
/**
 * @swagger
 * /organization-location-by-parent/list/{organizationTypeId}/{parentId}:
 *  get:
 *     tags:
 *     - Organization
 *     summary: Returns all organization locations by parentId
 *     description: /organization-location-by-parent/list/{organizationTypeId}/{parentId}?sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: organizationTypeId
 *        in: path
 *        required: true
 *        schema:
 *          type : string
 *          format: uuid
*      - name: parentId
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

// Swager API doc for /organization-list/data and controller function getOrganizationsByDropdown
/**
 * @swagger
 * /organization-list/data:
 *  get:
 *     tags:
 *     - Organization
 *     summary: Returns all organization without access
 *     description: /organization-list/data?organizationTypeId=UUID&parentId=UUID&sort=updatedAt&sort=DESC&rowPerPage=10&pageNumber=1
 *     parameters:
 *      - name: organizationTypeId 
 *        in: query
 *        schema:
 *          type : string
 *          format: uuid
 *      - name: parentId 
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