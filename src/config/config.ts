import dotenv from 'dotenv';

dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/loan-application-system',
  jwtSecret: process.env.JWT_SECRET || 'ehwajkhjkhwjkelgkjghj',
  jwtExpire: process.env.JWT_EXPIRE || '30d'
};

export default config;