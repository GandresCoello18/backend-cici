import * as envalid from 'envalid';
import path from 'path';

const { str, num } = envalid;

export const config = envalid.cleanEnv(
  process.env,
  {
    X_DEBBUGER_ENV: str(),
    DB_HOST: str(),
    DB_USER: str(),
    DB_PASSWORD: str(),
    DB_NAME: str(),
    DB_PORT: num(),
    APP_PORT: num(),
    JWT_SECRET: str(),
    TZ: str(),
    CLOUD_NAME: str(),
    API_KEY_CLOUDINARY: num(),
    API_SECRET_CLOUDINARY: str(),
    CORREO_NAMECHEAP: str(),
    CLAVE_NAMECHEAP: str(),
  },
  { strict: true, dotEnvPath: path.resolve(__dirname, '../../.env') },
);
