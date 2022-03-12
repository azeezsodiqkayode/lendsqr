const express = require('express')
const router = express.Router()
const authController  = require('../controllers/auth.controllers')


/**
 * Login the user
 * @swagger
 * /login:
 *   post:
 *     summary: Login the user
 *     description: This logs the user into the app
 *     tags:
 *       - Auth
 *     produces:	 
 *       - application/json	 
 *     parameters:	 
 *       - name: email	 
 *         in: body	 
 *         required: true
 *       - name: password	 
 *         in: body	 
 *         required: true
 *     responses:
 *        200:
 *          description: User successfully Login
 *        422:
 *          Bad Request
*/
router.post('/login', authController.login)

/**
 * Forget Password
 * @swagger
 * /start-forget-password/{email}:
 *   get:
 *     summary: Forget Password
 *     description: This sends email to the custoemr to
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         description: This is the customer email.
 *         schema:
 *           type: string
 *     responses:
 *        200:
 *         description: Successfully fetched users details.
 *        422:
 *          Bad Request
 *                     
*/
router.get('/start-forget-password/:email', authController.startForgetPassword)

router.patch('/complete-forget-password/:hash', authController.completeForgetPassword)





module.exports = router
