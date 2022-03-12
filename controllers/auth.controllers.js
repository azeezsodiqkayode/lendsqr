require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid') 
const ForgetPassword = require('../models/users.models')
const { isEmpty, asyncErrorHandler } = require('../utils/utils')
const { hashMyPassword, getUser, getUserDetailsByEmail } =  require('../controllers/users.controllers')
const Users = require('../models/users.models')





const login = async (req, res) => {
    const { email, password } = req.body

    let payload

    getUserDetailsByEmail(email)
    .then(resultFromLogin => {
        if (isEmpty(resultFromLogin)) {
            //log that the email does not exist
            throw new Error("Invalid Credentials")
        }
        
         payload = resultFromLogin.toJSON()
        
        // if (payload.isAccountBlocked == true) {
        //     throw new Error("Acccount restricted, contact support")
        // }

        return bcrypt.compare(password, payload.password)
        
    })
    .then(resultFromPasswordCompare => {
        if (resultFromPasswordCompare == false) {
            throw new Error("Invalid Email or Password")
        }

    
       
        const dataToAddInMyPayload = {
            email: payload.email,
            isAdmin: false,
            _id: uuidv4(),
            }
                jwt.sign(dataToAddInMyPayload, process.env.JWT_SECRET, { expiresIn : process.env.JWT_EXPIRES_TIME },
                (err, token) => {
                    if (err) {
                        throw new Error("Something went wrong")
                    }
                 
                    res.setHeader('token', token).status(200).send({
                                status: true,
                                message: "Successfully logged in ",
                                data: token
                   })
                   
                }
        

           )

         
        
    })
    .catch(err => {
        
        res.status(400).send({
            status: false,
            message: err.message || "Something went wrong"
        })
    })
  


}

const insertHash = async (data) => {
    return  ForgetPassword.forge(data).save()
}

const startForgetPassword = async (req, res) => {

    const { phone } = req.params
    
    try {
        
        let [err, checkIfEmailExist] = await asyncErrorHandler(getUser(phone))
        if (err) {
            //log from our end 
            //email does not exists
            throw new Error('This is on us, something went wrong', 400)
        }
        let checkIfEmailExistResp = checkIfEmailExist.toJSON()
        if (isEmpty(checkIfEmailExistResp)) {
            throw new Error(`If the email ${email} account exist with us, you will get a reset password email`)
        }
        let hash = uuidv4().replace(/-/gi, '')
        
        let [err2, createForgetPasword] = await asyncErrorHandler(insertHash({'phone':phone,'hash':hash}))
       
        if (err2) {
            throw new Error('Please try This is on us, something went wrong')
        }
        const createForgetPaswordResp = createForgetPasword.toJSON() 
        if (!isEmpty(createForgetPaswordResp)) {
            
            let dataReplacement = {
                "fullname": ` ${checkIfEmailExistResp.firstname}  ${checkIfEmailExistResp.surname}`,
                "resetPasswordlink": `${process.env.RESET_PASSWORD_LINK}/${hash}`
            }
            //send email

            smsServices.sendSMS(phone, `Hello ${dataReplacement}`)
            
        }
       

        res.status(200).send({
            status: true,
            message: `If the email ${email} account exist with us, you will get a reset password email`
        })


    } catch (e) {
        console.log(e)
        res.status(400).send({
            status: true,
            message: e.message 
        })

    }


}

const findHash = async (hash) => {

    return new ForgetPassword({ hash : hash })
        .fetch({ require: true })
        .then(userHash => {
            return userHash;
        }).catch(error => {

            //tell the developer what went wrong
            console.log(`Error retrieving hash, reason: ${error.message}`);
            return null;
        });
}


const completeForgetPassword = async (req, res) => {

    const {hash} = req.params
    const { newPassword, confirmNewPassword } = req.body
    try {
        const [err, checkIfHashIsValid] = await asyncErrorHandler(findHash(hash))
        if (err) {
            throw new Error('Internal Server Error', 500)
        }
        let checkIfHashIsValidResp = checkIfHashIsValid.toJSON() 
        if (isEmpty(checkIfHashIsValidResp)) {

            throw new Error('Unable to perform this operation', 400)
        }
        if (newPassword != confirmNewPassword) {
            throw new Error('Password does not match', 400)
        }
        let phone = checkIfHashIsValidResp.phone
        

        //update the password
        const passwordHashed = await hashMyPassword(newPassword)
        let [err2, updatePasswordResponse] = await asyncErrorHandler(Users.where({'phone': phone }).save({'password': passwordHashed[1]},{patch:true}))
        if (err2) {
            throw new Error('Internal Server Error', 500)
        }
        console.log("after ")
        // if (!isEmpty(updatePasswordResponse)) {
        //     throw new Error('Internal Server Error', 500)
        // }
        await ForgetPassword.where({ 'hash': hash }).destroy({require:true})

        res.status(200).send({
            status: true,
            message: `Password successfully updated`
        })
    }
catch (e) {
    console.log(e)
        res.status(400).send({
            status: false,
            message: e.message 
        })
}


}

// const logout = () => {
//     const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvc2hib25AZ21haWwiLCJwaG9uZSI6IjA4MDg0MjU5MzcyIiwiaWQiOiI5NTVlMTgzZC05ZDgxLTQ4ODAtYjUwZi0wYjYxN2Y2MDYyZDAiLCJpYXQiOjE2NDQ0Mzk4NTcsImV4cCI6MTY0NDQ0MzQ1N30.ozOgwaUIezSbCPSo454QguZnpZ3GzaZDNikmccMgqqY"
//     jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
//         console.log(JSON.stringify(decoded)) // bar
//       });
// }

module.exports = {
    login,
    startForgetPassword,
    completeForgetPassword
     
}
