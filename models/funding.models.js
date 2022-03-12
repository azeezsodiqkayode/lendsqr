const knex = require('../config/mysql').knex;
const bookshelf = require('bookshelf')(knex);

const Funding = bookshelf.Model.extend({
    tableName: 'funding'
});

module.exports = Funding;