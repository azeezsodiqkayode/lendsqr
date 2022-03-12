

const knex = require('../config/mysql').knex;
const bookshelf = require('bookshelf')(knex);

const ForgetPassword = bookshelf.Model.extend({
    tableName: '_forget_password'
});

module.exports = ForgetPassword;