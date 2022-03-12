

require('dotenv').config()
const Joi = require('joi')
const { v4: uuidv4 } = require('uuid')
const msgClass = require('../errors/error')
const { isEmpty, asyncErrorHandler } = require('../utils/utils')
const withdrawalModels = require('../models/withdrawal.models')
const purchasevalidation = require('../validations/purchases.validations')
const withdrawalServices = require('../services/withdrawal.services')
const usersController = require('../controllers/users.controllers')
const Users = require('../models/users.models')
const Withdrawal = require('../models/withdrawal.models')





const addWithdrawalRecipient = async (req, res) => {

    const{accountName, accountNumber, bankCode} = req.body

    const recipientSchema = Joi.object({
        accountName: Joi.string().required(),
        accountNumber: Joi.string().required(),
        bankCode: Joi.string().required()
    })

    try{
        const responseFromJoiValidation = recipientSchema.validate(req.body)
        if(responseFromJoiValidation.error){
            throw new Error ("Bad request")
        }

        const addWithdrawalRecipientResponse = await withdrawalServices.createWithdrawalRecipient(req.body)

        if(addWithdrawalRecipientResponse.data.status == false){
            throw new Error ("Sorry, can't add recipient at the moment")
        }

        res.status(200).send({
            status: true,
            message: "Recipient added successfully",
            data: addWithdrawalRecipientResponse.data.data
        })
    } 
    catch(e) {
       // console.log(`error: ${e.message}`)
        res.status(400).send({
            status: false,
            message:   e.message || msgClass.GeneralError

     })
    }

}

const deductUserBalance = async(phone, amount)=>{
    try{
        const [err, getUserDetails] = await asyncErrorHandler(usersController.getUser(phone))
        if (err){
            throw new Error("Internal Server Error")

        }
        if(isEmpty(getUserDetails)){
            throw new Error("Unable to withdraw")
        }

        const userDetails = getUserDetails.toJSON()
        const {balance} = userDetails
        if (amount >= balance){
            throw new Error ("Insufficient funds")
        }
        const newBalance = parseFloat(balance) - parseFloat(amount)

        await Users.where({'phone': phone }).save({'balance': newBalance},{patch:true})
        res.status(200).send({
            status: true,
            message: "Withdrawal successfully initiated",
        })
    } catch(e) {
    // console.log(`error: ${e.message}`)
        res.status(400).send({
            status: false,
            message:   e.message || msgClass.GeneralError

    })

}
}

const createWithdrawal = async(data)=>{
    return Withdrawal.forge(data).save()
}

const initializingWithdrawal = async (req, res) =>{

    const{transferNote, amount, recipient_id, user_id} = req.body

    const withdrawSchema = Joi.object({
        amount: Joi.string().required(),
        transferNote: Joi.string().required(),
        recipient_id: Joi.string().required()
    })

    try{
        const responseFromJoiValidation = withdrawSchema.validate(req.body)
        if(responseFromJoiValidation.error){
            throw new Error ("Bad request")
        }

        await deductUserBalance()
        const [err, initialWithdrawalResponse] = await asyncErrorHandler(withdrawalServices.initializeWithdrawal(req.body))
        if (err){
            throw new Error ("Internal Server Error")
        }

        if(initialWithdrawalResponse.data.status == false){
            let status = "failed"

            const createWithdrawalResp = await createWithdrawal({
                'user_id': user_id,
                'amount': amount,
                'recipient_id': recipient_id,
                'status': status
            })
            if(createWithdrawalResp !== null)
            throw new Error ("Sorry, Withdrawal cannot be initiated at the moment")
        }
        
        let status = "Processed"
         await createWithdrawal({
                                    'user_id': user_id,
                                    'amount': amount,
                                    'recipient_id': recipient_id,
                                    'status': status
                                })
        
        

        res.status(200).send({
            status: true,
            message: "Withdrawal successfully initiated",
            data: initialWithdrawalResponse.data.data
        })
    } 
    catch(e) {
       // console.log(`error: ${e.message}`)
        res.status(400).send({
            status: false,
            message:   e.message || msgClass.GeneralError

     })
    }

}


module.exports = {
    addWithdrawalRecipient,
    deductUserBalance,
    initializingWithdrawal,
    
}