const knex = require('../config/mysql').knex;
const bookshelf = require('bookshelf')(knex);

const Withdrawal = bookshelf.Model.extend({
    tableName: 'withdrawals'
});

module.exports = Withdrawal;