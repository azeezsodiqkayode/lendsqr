

const express = require('express');
const router = express.Router();
const {authentication} = require('../middlewares/authentication')
const { authorization } = require('../middlewares/authorization')
const transferController = require('../controllers/transfer.controllers');



/**
 * Transfer between users 
 * @swagger
 * /transfer/initiate:
 *   post:
 *     summary: Make transfer between users 
 *     description: This is to transfer funds between two users
 *     tags:
 *       - Transfer
 *     parameters:
 *       - name: senderPhone
 *         in: body
 *         required: true
 *         description: This is the sender phone number
 *         schema:
 *           type: string
 *       - in: body
 *         name: receiverPhone
 *         required: true
 *         description: This is the receiver phone number
 *         schema:
 *           type: string
 *       - in: body
 *         name: amount
 *         required: true
 *         description: This is the amount to be transferred
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Funds successfully transferred.
 *       422:
 *          Bad Request
 *                     
*/
router.post('/transfer/initiate', transferController.createTransfer)



module.exports = router