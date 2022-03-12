const express = require('express');
const router = express.Router();
const {authentication} = require('../middlewares/authentication')
const { authorization } = require('../middlewares/authorization')
const fundingController = require('../controllers/funding.controllers');


/**
 * Initiate wallet funding
 * @swagger
 * /payment/initialize:
 *   post:
 *     summary: Initiate wallet funding
 *     description: This is to fund user balance
 *     tags:
 *       - Payment
 *     produces:     
 *       - application/json
 *     parameters:   
 *       - name: email   
 *         in: body  
 *         required: true
 *       - name: amount  
 *         in: body  
 *         required: true
 *     responses:
 *        201:
 *          description: funding successfully initiated
 *        422:
 *          Bad Request
*/
router.post('/payment/initialize', authentication, fundingController.createTransaction);


/**
 * Verify wallet funding
 * @swagger
 * /payment/verify/{payment_ref}:
 *   get:
 *     summary: Initiate wallet funding
 *     description: This is to fund user balance
 *     tags:
 *       - Payment
 *     produces:     
 *       - application/json
 *     parameters:   
 *       - name: payment_ref     
 *         in: path  
 *         required: true
 *       - name: amount  
 *         in: body  
 *         required: true
 *     responses:
 *        201:
 *          description: funds added successfully
 *        422:
 *          Bad Request
*/
router.get('/payment/verify/:payment_ref', authentication, fundingController.verifyTransaction);

module.exports = router