const express = require('express');
const router = express.Router();
const withdrawalController = require('../controllers/withdrawal.controllers');


/**
 * Add withdrawal recipient 
 * @swagger
 * /payout/add-recipient:
 *   post:
 *     summary: Add account details for withdrawal  
 *     description: This is to add account details for withdrawal
 *     tags:
 *       - Withdrawal
 *     parameters:
 *       - name: accountName
 *         in: body
 *         required: true
 *         description: User Bank Account Name
 *         schema:
 *           type: string
 *       - in: body
 *         name: accountNumber
 *         required: true
 *         description: User Bank Account Number
 *         schema:
 *           type: string
 *       - in: body
 *         name: bankCode
 *         required: true
 *         description: Bank code 
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipient added successfully.
 *       422:
 *          Bad Request
 *                     
*/
router.post('/payout/add-recipient', withdrawalController.addWithdrawalRecipient)



/**
 * Initiate withdrawal
 * @swagger
 * /payout/initiate:
 *   post:
 *     summary: withdrawal to bank  
 *     description: This is to withdraw balance to bank 
 *     tags:
 *       - Withdrawal
 *     parameters:
 *       - name: amount
 *         in: body
 *         required: true
 *         description: amount to withdraw
 *         schema:
 *           type: string
 *       - in: body
 *         name: recipient_id
 *         required: true
 *         description: ID from the recipient details added 
 *         schema:
 *           type: string
 *       - in: body
 *         name: transferNote
 *         required: optional
 *         description: add a little withdrawal note 
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: withdrawal successfully initiated.
 *       422:
 *          Bad Request
 *                     
*/
router.post('/payout/initiate', withdrawalController.initializingWithdrawal)

module.exports = router