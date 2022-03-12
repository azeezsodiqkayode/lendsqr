require('dotenv').config()

// const mysql = require('mysql2')
// //const mysql = require('mysql2/promise')

// module.exports =   mysql.createConnection({
//                             host: process.env.DATABASE_HOST,
//                             user: process.env.DATABASE_USER,
//                             password: process.env.DATABASE_PASSWORD,
//                             database: process.env.DATABASE_NAME,
//                             port: process.env.DATABASE_PORT
// })


const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : process.env.DATABASE_HOST,
      port : process.env.DATABASE_PORT,
      user : process.env.DATABASE_USER,
      password : process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      charset  : 'utf8'
  },
  logging:true
});


module.exports.knex =knex