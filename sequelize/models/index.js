'use strict';

const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configPath = path.join(__dirname, '/../config/config.js');

// Ensure the config file exists
if (!fs.existsSync(configPath)) {
  throw new Error(`Configuration file not found at ${configPath}`);
}

let config;
try {
  config = require(configPath)[env];
} catch (error) {
  throw new Error(`Error loading configuration for environment: ${env}, ${error.message}`);
}

if (!config) {
  throw new Error(`No configuration found for environment: ${env}`);
}

const db = {};

let sequelize;
if (config.use_env_variable) {
  const dbUrl = process.env[config.use_env_variable];
  if (!dbUrl) {
    throw new Error(`Environment variable ${config.use_env_variable} is not set`);
  }
  sequelize = new Sequelize(dbUrl, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Ensure the database connection is successful
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

try {
  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.js' &&
        file.indexOf('.test.js') === -1
      );
    })
    .forEach(file => {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    });
} catch (error) {
  console.error(`Error reading model files: ${error.message}`);
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
