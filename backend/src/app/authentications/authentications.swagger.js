// Swager API doc for /auth/google-captcha-keys and controller function getGoogleKeys
/**
 * @swagger
 * /auth/google-captcha-keys:
 *  get:
 *     tags:
 *     - Authentication
 *     summary: Returns Secret and site key for Google Captcha
 *     description: Returns Secret and site key for Google Captcha
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
 * /auth/update-password/{id}:
 *  put:
 *     tags:
 *     - Authentication
 *     summary: Update a password by id
 *     description: Update a password by id
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
 *             anyOf:
 *               - $ref: '#/components/schemas/WebApplication'
 *               - $ref: '#/components/schemas/MobileApplication'
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
 * 
 * /auth/login:
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Returns token in response
 *     description:  Returns token in response
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/WebLogin'
 *               - $ref: '#/components/schemas/MobileLogin' 
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
 * components:
 *   schemas:
 *     WebApplication:
 *       type: object
 *       properties:
 *         newPassword:
 *           type: string
 *
 *     MobileApplication:
 *       type: object
 *       properties:
 *         newMpin:
 *           type: string
 *         imeiNumber:
 *           type: string
 *         imeiNumber2:
 *           type: string
 * 
 *     WebLogin:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 * 
 *     MobileLogin:
 *       type: object
 *       properties:
 *         mPin:
 *           type: string
 *         userId:
 *           type: string
 */

// Swager API doc for /auth/logout
/** 
 * @swagger
 * /auth/logout:
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Log user out
 *     description:  Remove sessions from database and mark user as logout
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *           type: object
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
