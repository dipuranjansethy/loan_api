import { cleanEnv, str, port } from 'envalid';

export default function validateEnv() {
  return cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'production', 'test'],
      default: 'development'
    }),
    PORT: port({ default: 5000 }),
    MONGODB_URI: str(),
    JWT_SECRET: str(),
    JWT_EXPIRE: str({ default: '30d' })
  });
}