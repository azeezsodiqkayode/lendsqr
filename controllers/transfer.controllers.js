require('dotenv').config()
const { isEmpty, asyncErrorHandler } = require('../utils/utils')
const Joi = require('joi')
const { v4: uuidv4 } = require('uuid')
const msgClass = require('../errors/error')
const transferModel = require('../models/transfer.models')
const usersModel = require('../models/users.models')
const {getUserDetails} = require('../controllers/users.controllers')
const Transfer = require('../models/transfer.models')
const Users = require('../models/users.models')


const insertTransfer = async (data) => {
    return  Transfer.forge(data).save()
}

const createTransfer = async (req, res) =>{
    const {senderPhone, receiverPhone, amount} = req.body

    // const sender_id
    // const receiver_id 
    const transaction_id = uuidv4()

    try {

        const [err, responseFromGetSenderId] = await asyncErrorHandler(getUserDetails(senderPhone))
        if (err){
            throw new Error (err)
        }
        let senderDetails = responseFromGetSenderId.toJSON()
        if(isEmpty(senderDetails)){
            throw new Error ("User can't perform operation")
        }
        const senderBalance = parseInt(senderDetails.balance)
        if (senderBalance < parseInt(amount)){
            throw new Error ("Insufficient Funds, please top up and try again")
        }

        const[err2, responseFromGetReceiverId] = await asyncErrorHandler(getUserDetails(receiverPhone))
        if (err2){
            throw new Error ("Internal Server Error")
        }
        let receiverDetails = responseFromGetReceiverId.toJSON()
        if(isEmpty(receiverDetails)){
            throw new Error("Receiver can't accept at this time, try again")
        }

        const receiverBalance = receiverDetails.balance

        const newSenderBalance = parseFloat(senderBalance) - parseFloat(amount)
        const newReceiverBalance = parseFloat(receiverBalance) + parseFloat(amount)


 const sender_id = senderDetails.user_id
        const receiver_id = receiverDetails.user_id

        await Users.where({'user_id': sender_id }).save({'balance': newSenderBalance},{patch:true})
        await Users.where({'user_id': receiver_id }).save({'balance': newReceiverBalance},{patch:true})

        const insertTransferResp = await insertTransfer({
            'sender_id': sender_id,
            'receiver_id': receiver_id,
            'transaction_id': transaction_id,
            'amount': amount
        })

        if (insertTransferResp == null) {
            throw new Error('Cannot transfer funds at the moment, try again')
        }
        
        res.status(200).send({
            status: true,
            message: "Funds successfully transferred"
        })

    } catch (e) {
        res.status(200).send({
            status: false,
            message: e.message || "Something went wrong"
        
        })
    
    
    }


}

module.exports ={
    createTransfer
}