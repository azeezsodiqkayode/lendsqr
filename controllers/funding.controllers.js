require('dotenv').config()
const { isEmpty, asyncErrorHandler } = require('../utils/utils')
const Joi = require('joi')
const { v4: uuidv4 } = require('uuid')
const msgClass = require('../errors/error')
const fundingService = require('../services/funding.services')
const fundingModel = require('../models/funding.models')
const usersModel = require('../models/users.models')
const usersController = require('../controllers/users.controllers')
const Funding = require('../models/funding.models')
const {getUser} = require('../controllers/users.controllers')

const insertTransaction = async (data) => {
    return  Funding.forge(data).save()
}


const createTransaction = async (req, res) => {


   // const { amount, paymentOptionType, email, phone, fullname, customer_id } = req.body
    const { amount, email, user_id } = req.body
    const reference = uuidv4()
    

    const paymentSchema = Joi.object({
        phone: Joi.string().required(),
        amount: Joi.string().required(),
        paymentOptionType: Joi.string().valid('card','banktransfer','ussd').required()

    })

    const responseFromJoiValidation = paymentSchema.validate(req.body)
        if (responseFromJoiValidation.error) {
            throw new Error("Bad request")
        }
    try {
    
        const [err, fundingInitializationResponse] = await asyncErrorHandler(fundingService.initializePayment(email, amount,reference))
        if (err){
            throw new Error ("Internal Server Error")
        }
        console.log("Got back from paysatck: ", JSON.stringify(fundingInitializationResponse.data))
        if (fundingInitializationResponse.data.status == false) {
           throw new Error("Sorry, payment cannot be initialise this moment")
            
        }

        const status = "pending"
        //initiate db


        const insertFundingResp = await insertTransaction({
            'user_id': user_id,
            'amount': amount,
            'reference': reference,
            'status': status
        })
        
        if (insertFundingResp == null) {
            throw new Error('Cannot fund account at the moment, try again')
        }

        res.status(200).send({
            status: true,
            message: "funding successfully initiated",
            data: fundingInitializationResponse.data.data
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


const verifyTransaction = async (req, res) => {

    const { payment_ref} = req.params
    const {user_id, amount} = req.body

    
    try {
 
        const [fundingVerificationErr, fundingVerificationResponse ] = await asyncErrorHandler(fundingService.verifyPayment(payment_ref)) 
        if (fundingVerificationErr) {
            throw new Error ("something went wrong")
        }
        if(isEmpty(fundingVerificationResponse)){
            throw new Error("We could not verify the amount paid. Kindly contact support")
        }

        if (fundingVerificationResponse.data.data.status == "success"){
            const status = "completed"
            await fundingModel.updateTransaction(status, payment_ref)
            const [err, getUserDetailsResponse] = await asyncErrorHandler(getUser(email))
            if (err){
                throw new Error ("Internal Server Error")
            }
            let userDetails = getUserDetailsResponse.toJSON()
            const balance = userDetails.balance
            const newBalance = parseFloat(balance) + parseFloat(amount)
            usersModel.updateBalance(newBalance, user_id) 

        }
        if(fundingVerificationResponse.data.data.status !== "success"){
            const status ="failed"
            await Funding.where({'reference': payment_ref }).save({'status': status},{patch:true})
        }
         
        res.status(200).send({
            status: true,
            message: "funds added successfully",
            data: fundingVerificationResponse.data.data
        })
    }
    catch (err) {
        res.status(400).send({
            status: false,
            message: err
 
        })
    }
     


}



module.exports = {
    createTransaction,
    verifyTransaction
}