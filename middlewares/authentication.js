require('dotenv').config()
const jwt = require('jsonwebtoken');
const {getUserDetailsByEmail} = require('../controllers/users.controllers')
const authentication = (req, res, next) => {


    const token = req.headers.authorization
    
    
    if (!token) {
        res.status(401).send({
            status: false,
            message: 'Unauthorized Access'
                    
        })
    }
    const tokenSplit = token.split(" ")
    jwt.verify(tokenSplit[1], process.env.JWT_SECRET, async(err, decoded)=> {

         if (err) {
            res.status(401).send({
                status: false,
                message: 'Unauthorized Access'
                        
            })
         }
         
         req.body.customerEmail = decoded.email
         req.body.fakeId =  decoded._id
         

         const userDetails = await getUserDetailsByEmail(req.body.customerEmail)
         const {user_id} = userDetails.toJSON()
         req.body.user_id = user_id
         next() 
         
         
         
     })
    


}


module.exports = {
    authentication
}


// if (!username || !password) {
//     res.status(422).send({
//         status: "sucess",
//         message: 'Bad request',
//         data: []
        
    
//     })
// }

// if (username == hiddenUsername && password == hiddenPassword) {
// next()

// } else {
//     res.status(401).send({
//         status: "sucess",
//         message: 'Unauthorized Acesss',
//         data: []
        
    
//     })
// }