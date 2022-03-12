require('dotenv').config()
const axios = require('axios').default
const { v4: uuidv4 } = require('uuid')
const fetch = require('node-fetch')


const initializePayment = async (email, amount, reference) => {
    return axios({
        method: 'post',
        url: `${process.env.PAYSTACK_BASE_URL}/transaction/initialize`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
        data: {
            email: email,
            amount: parseFloat(amount) * 100,
            currency: 'NGN',
            reference: reference
        },
    });
};


const verifyPayment = async(payment_ref) => {

    return axios({
        method: "get",
        url: `${process.env.PAYSTACK_BASE_URL}/transaction/verify/${payment_ref}`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        },
    })
    
}

module.exports = {
    initializePayment,
    verifyPayment


}