require('dotenv').config()
const { v4: uuidv4 } = require('uuid')
const { Op } = require('sequelize')
const Joi = require('Joi')
const bcrypt = require('bcrypt')
const util = require('util')
const { isEmpty, asyncErrorHandler } = require('../utils/utils')
const saltRounds = 10
const smsServices = require('../services/sms.services')
const Users = require('../models/users.models')
const Otp = require('../models/otp.models')
const otpModel = require('../models/otp.models')
const msgClass = require('../errors/error')
const logger = require('../logger')



const hashMyPassword = (mypassword) => {
    
    return new Promise((resolve, reject) => {

        bcrypt.genSalt(saltRounds,  (err, salt)=> {
            bcrypt.hash(mypassword, salt,  (err, hash)=> {
                if (err) {
                    reject(err)
                }
                resolve([salt, hash])
            });
        });
 

    })
}

const getUserDetails = async(phone) =>{
    
    let userDetails = await Users.where({ 'phone': phone }).fetch({require:true});
    
    return userDetails
    
}

const getUserDetailsByEmail = async(email) =>{
    
    let userDetails = await Users.where({ 'email': email }).fetch({require:true});
    
    return userDetails
    
}

const generateOTP = ()=>{

    return Math.floor(Math.random() * 10000)
}

const checkUserByEmailOrPhone = async (email, phone) => {


    return Users.where((qb) => {
        qb.where((qb1) => {
          qb1
            .where({
              email: email,
            })
            .orWhere({
              phone: phone,
            })
        });
      })
    // return new Users({ email : email }, {phone: phone})
        .fetch({ require: true })
        .then(user => {
            delete user.attributes.password; //never return the user's password
            return user;
        }).catch(error => {

            //tell the developer what went wrong
            // console.log(`Error retrieving user with email ${email}, reason: ${error.message}`);
            return null;
        });
}


    
const createUser = async (data) => {
        return  Users.forge(data).save()
    }


const getUser = async(req, res) => {
   
    const  {phone}  = req.params
    try {
    let userDetails = await Users.where({ 'phone': phone }).fetch({require:true});
    let {user_id} = userDetails.toJSON()
        delete userDetails.attributes.password
        res.status(200).send({
            status: true,
            message: "User details fetched",
            data: userDetails.toJSON()
        })
    } catch (e) {
        res.status(400).send({
            status: false,
            message: e
        })
    }
}

const createNewUser = async (req, res) => {
    const user_id = uuidv4()
    const otp = generateOTP()
 
    const userSchema = Joi.object({
        firstname: Joi.string().required(),
        surname: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string(), //length(11).pattern(/^[0-9]+$/),
        password: Joi.string().required()
    })

    const validateUser = userSchema.validate(req.body)
    if (validateUser.error) {
        logger.info("Seems there was validation error %s", validateUser.error.details[0].message)
        res.status(422).send({
            status: false,
            message: validateUser.error.details[0].message
        })
    }

    const { email, firstname, surname, password, phone } = req.body
     req.body.otp = generateOTP()
    
    try {
        let checkIfUserExist = await checkUserByEmailOrPhone(email,phone)
   
        if (checkIfUserExist != null) {
            throw new Error("User with Email/Phone exists")
        }

        const [passwordSalt, passwordHashed] = await hashMyPassword(password)
      
        const createUserResp =  await createUser({
            'email': email,
            'firstname': firstname,
            'surname': surname,
            'password': passwordHashed,
            'phone': phone,
            'user_id': user_id
        })

        // console.log("createUserResp: ", createUserResp)
        if (createUserResp == null) {
            console.log("create user resp is null")
            throw new Error('Cannot create user at the moment, try again')
        }
        
       await otpModel.forge({ 'user_id': user_id, 'otp': otp, 'phone': phone }).save()
        //send otp to user after registration
       await smsServices.sendSMS(phone, `Hello, your otp is ${otp}`)
    
        res.status(200).send({
            status: true,
            message: "User successfully created",
            data: []
        })
    } catch (e) {
        res.status(400).send({
            status: false,
            message: e.message
        })
    }

}

const verifyOTP = (req, res) => {

    const { phone, otp } = req.params

    
    otpModel.where({ 'phone': phone, 'otp':otp }).fetch({require:true})
    // usersModel.getOtp(user_id, otp)
    .then(otpResult => {
        //console.log("hereis otpResult: ", otpResult)
        if (otpResult == "") {
            throw new Error(msgClass.OtpMismatch)
        }
        let otpResultDetails =otpResult.toJSON()
        const elapsedTime = Date.now() -  otpResultDetails.createdAt
        if ((Math.floor(elapsedTime / 60000) > process.env.OTPExpirationTime)) {
            throw new Error(msgClass.OtpExpired)
        }
        //update datavad onis OTpverified
        // usersModel.deleteOTP(otp, otpResult[0].user_id)
        otpModel.where({ 'phone': phone, 'otp':otp }).destroy({require:true})
        //usersModel.updateOTPStatus(otpResult[0].user_id)
        Users.where({'user_id':otpResultDetails.user_id}).save({'isotpVerified': 1},{patch:true})

    })
        .then(finalResponse => {
            const dataToUpdate = {}
    
            smsServices.sendSMS(phone, "Welcome to Lendsqr, thanks for verifying your account. Nice to have you on board") 
            
        res.status(200).send({
            status: false,
            message: msgClass.OtpVerificationSuccessful,
            data: []
        })
    })
    .catch(err => {
        res.status(400).send({
            status: false,
            message: err.message || msgClass.GeneralError,
            data: []
        })
    })



}


const updateUser = () => {

    res.status(200).send({
        status: true,
        message: "Account successfully updated",
        data: []
    })
}



const insertOtp = async (data) => {
    return  Otp.forge(data).save()
}


const resendOtp =   async (req, res) => {
    const { phone } = req.params
    const otp = generateOTP()
    
    try {

        //const userDetails = await usersModel.getUserDetailsByPhone(phone)
        const userDetails = await Users.where({ 'phone': phone }).fetch({require:true})
        let {user_id} = userDetails.toJSON()
        // await usersModel.deleteOTPByCustomerID(userDetails[0].user_id)
        await otpModel.where({ 'user_id': user_id }).destroy({require:true})
        // await usersModel.insertOtp(userDetails[0].user_id, otp)


        const insertOtpResp = await insertOtp({
            'user_id': user_id,
            'otp': otp,
        })

        if (insertOtpResp == null) {
            throw new Error('Cannot update Otp at the moment, try again')
        }
        
        await smsServices.sendSMS(phone, `Hello, your new otp is ${otp}`)
        
        res.status(200).send({
            status: true,
            message: msgClass.OtpResentSentSuccessfully,
            data: []
        })

    } catch (err) {
        console.log(err)
        res.status(200).send({
            status: true,
            message: msgClass.GeneralError,
            data: []
        })
    }


  
}

module.exports = {
    createNewUser,
    getUser,
    getUserDetails,
    getUserDetailsByEmail,
    checkUserByEmailOrPhone,
    updateUser,
    verifyOTP,
    resendOtp,
    hashMyPassword
}