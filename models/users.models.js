
// 'use strict';

// const mysqlConnection = require('../config/mysql')



// const getUserDetailsByEmail =  async ( email) => {
   
//     return new Promise((resolve, reject) => {

//         mysqlConnection.query({
//             sql: `select * from users where email=?`,
//             values: [email]
//         },
//           (err, results, fields) => {
//                 if (err) {
//                  reject(err)
//                 }
//                 resolve(results)
//           })
//     })
// }


// const getUserDetailsByUser_id =  async ( user_id) => {
   
//     return new Promise((resolve, reject) => {

//         mysqlConnection.query({
//             sql: `select * from users where user_id=?`,
//             values: [user_id]
//         },
//           (err, results, fields) => {
//                 if (err) {
//                  reject(err)
//                 }
//                 resolve(results)
//           })
//     })
// }


// const insertOtp =   async (user_id, otp) => {
//     return new Promise( (resolve, reject) => {
//         mysqlConnection.query(
//             {
//                 sql: `Insert into _otps(user_id,otp)values(?,?)`,
//                 values: [user_id, otp]
//             },
//             (err, results, fields) => {
//              if (err) {
//                reject(err);
//              }
//              resolve(results);
//          })
//       })
 
 
 
 
// }


// const getOtp =   (user_id, otp) => {
//     return new Promise( (resolve, reject) => {
//         mysqlConnection.query(
//             {
//                 sql: `select * from _otps where user_id =? and otp=?`,
//                 values: [user_id, otp]
//             },
//             (err, results, fields) => {
//              if (err) {
//                reject(err);
//              }
//              resolve(results);
//          })
//       })
 
 
 
 
// }

// const newUser =   async (email, firstname, surname, password, phone, user_id, balance) => {
//        return new Promise( (resolve, reject) => {
//            mysqlConnection.query({
//                sql: `Insert into users(email, firstname, surname, password, phone, user_id, balance)values(?,?,?,?,?,?,?)`,
//                values: [email, firstname, surname, password, phone, user_id, balance]
//            }
//             ,  (err, results, fields) => {
//                 if (err) {
//                   reject(err);
//                 }
//                 resolve(results);
//             })
//          })
    
    
    
    
// }



// const checkUser = async (email, phone) => {
   
//     return new Promise((resolve, reject) => {

//         mysqlConnection.query({
//             sql: `select * from users where email=? or phone=?`,
//             values: [email, phone]
//         },
//           (err, results, fields) => {
//                 if (err) {
//                  reject(err)
//                 }
//                 resolve(results)
//           })
//     })
// }


// const deleteOTP = async (otp, user_id) => {
   
//     return new Promise((resolve, reject) => {

//         mysqlConnection.query({
//             sql: `delete from _otps where otp=? and user_id=?`,
//             values: [otp, user_id]
//         },
//           (err, results, fields) => {
//                 if (err) {
//                  reject(err)
//                 }
//                 resolve(results)
//           })
//     })
// }


// const updateOTPStatus = async (user_id) => {
   
//     return new Promise((resolve, reject) => {

//         mysqlConnection.query({
//             sql: `update users set isotpVerified=? where user_id=?`,
//             values: [1, user_id]
//         },
//           (err, results, fields) => {
//                 if (err) {
//                  reject(err)
//                 }
//                 resolve(results)
//           })
//     })
// }

// const updateBalance = async(newBalance, user_id) => {

//     return new Promise((resolve, reject) => {

//         mysqlConnection.query({
//             sql: `update users set balance=? where user_id=?`,
//             values: [newBalance, user_id]
//         },
//           (err, results, fields) => {
//                 if (err) {
//                  reject(err)
//                 }
//                 resolve(results)
//           })
//     })

// }

// const forgetPasswordModel = async(email, hash) => {
//     return new Promise( (resolve, reject) => {
//         mysqlConnection.query(
//             {
//                 sql: `Insert into _forget_password(email,hash)values(?,?)`,
//                 values: [email,hash]
//             },
//             (err, results, fields) => {
//              if (err) {
//                reject(err);
//              }
//              resolve(results);
//          })
//       })
 
 
 
 
// }

// const validateHash = async (hash) => {
   
//     return new Promise((resolve, reject) => {

//         mysqlConnection.query({
//             sql: `select * from _forget_password where hash=?`,
//             values: [hash]
//         },
//           (err, results, fields) => {
//                 if (err) {
//                  reject(err)
//                 }
//                 resolve(results)
//           })
//     })
// }

// const updatePassword = async (password, email) => {

   
//     return new Promise((resolve, reject) => {

//         mysqlConnection.query({
//             sql: `update users set password=? where email=?`,
//             values: [password, email]
//         },
//           (err, results, fields) => {
//                 if (err) {
//                  reject(err)
//                 }
//                 resolve(results)
//           })
//     })
// }

// const deleteResetPasswordRecord = async (hash) => {
   
//     return new Promise((resolve, reject) => {

//         mysqlConnection.query({
//             sql: `delete from _forget_password where hash=?`,
//             values: [hash]
//         },
//           (err, results, fields) => {
//                 if (err) {
//                  reject(err)
//                 }
//                 resolve(results)
//           })
//     })
// }


// module.exports = {
//     newUser,
//     checkUser,
//     insertOtp,
//     getOtp,
//     deleteOTP,
//     updateOTPStatus,
//     updateBalance,
//     getUserDetailsByUser_id,
//     getUserDetailsByEmail,
//     forgetPasswordModel,
//     validateHash,
//     deleteResetPasswordRecord,
//     updatePassword
// }


const knex = require('../config/mysql').knex;
const bookshelf = require('bookshelf')(knex);

const User = bookshelf.Model.extend({
    tableName: 'users'
});

module.exports = User;