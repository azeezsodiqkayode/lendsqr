
const knex = require('../config/mysql').knex;
const bookshelf = require('bookshelf')(knex);

const Otp = bookshelf.Model.extend({
    tableName: '_otps'
});

module.exports = Otp;