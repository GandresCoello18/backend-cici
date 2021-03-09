import * as envalid from 'envalid';
import path from 'path';

const { str } = envalid;

export const config = envalid.cleanEnv(
  process.env,
  {
    X_DEBBUGER_ENV: str(),
    DB_HOST: str(),
    DB_USER: str(),
    DB_PASSWORD: str(),
    DB_NAME: str(),
    DB_PORT: str(),
    JWT_SECRET: str(),
    TZ: str()
  },
  { strict: true, dotEnvPath: path.resolve(__dirname, '../../.env') },
);
