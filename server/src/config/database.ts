import { Sequelize } from 'sequelize';
import * as config from './config.json';

const env = (process.env.NODE_ENV as keyof typeof config) || 'development';
const dbConfig = config[env];

if (!dbConfig) {
  throw new Error(`Configuration for environment "${env}" is missing.`);
}

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect as 'postgres' | 'mysql' | 'sqlite' | 'mariadb' | 'mssql',
  define: dbConfig.define || { timestamps: false },
  logging: false,
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}


testConnection();

export default sequelize;
