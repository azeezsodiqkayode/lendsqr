require('dotenv').config()
const axios = require('axios').default
const { v4: uuidv4 } = require('uuid')



const getBankcode= () => {

    return axios({
    method: "get",
    url: `${process.env.PAYSTACK_BASE_URL}/bank`,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
    },
})
}

const verifyAccountNumber = () => {

    return axios({
    method: "get",
    url: `${process.env.PAYSTACK_BASE_URL}/bank/resolve`,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
    },
})
}



const createWithdrawalRecipient = async (accountName, accountNumber, bankCode) => {
    
    const confirmAccountNumber = await verifyAccountNumber()

    return axios({
        method: "post",
        url: `${process.env.PAYSTACK_BASE_URL}/transferrecipient`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken.data.access_token}`
        },
        data: {
                "type": "nuban",
                "name":accountName,
                "account_number": accountNumber,
                "bank_code": bankCode,
                "currency": "NGN"
        }
    })

}


const initializeWithdrawal = async(transferNote, amount, recipient_id) => {

    return axios({
                    method: "post",
                    url: `${process.env.PAYSTACK_BASE_URL}/transfer`,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                    },
                    data: {
                        "source": "balance",
                        "reason": transferNote,
                        "amount": parseFloat(amount) * 100,
                        "recipient": recipient_id,
                        
                    }
                })
}




module.exports = {
    getBankcode,
    initializeWithdrawal,
    createWithdrawalRecipient,
    verifyAccountNumber,


}