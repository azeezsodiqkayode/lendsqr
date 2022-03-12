const knex = require('../config/mysql').knex;
const bookshelf = require('bookshelf')(knex);

const Transfer = bookshelf.Model.extend({
    tableName: 'transfers'
});

module.exports = Transfer;