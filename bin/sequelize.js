var Sequelize = require('sequelize');
var config = require('../config.js');
var sequelize = new Sequelize(config.database, config.username, config.password,{
    host: config.host,
    dialect: 'mysql',
})
module.exports = sequelize;