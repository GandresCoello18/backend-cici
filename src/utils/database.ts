import mysql from "mysql";
import {config} from './config';

const conectar = () => {
  const connection = mysql.createConnection({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_HOST === 'localhost' ? '' : config.DB_PASSWORD,
    database: config.DB_NAME,
    port: config.DB_PORT,
  });

  try {
    connection.connect();
    console.log("conectado con exito");

    connection.on("err", (err: any) => {
      if (err) console.log(err);
    });

    return connection;
  } catch (error) {
    connection.end();
    return connection;
  }
}

export const dataBase = conectar();