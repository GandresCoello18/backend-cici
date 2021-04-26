import mysql from "mysql";
import {config} from './config';

class Mysql {
  constructor() {
    this.conectar();
  }

  conectar() {
    const connection = mysql.createConnection({
      host: config.DB_HOST,
      user: config.DB_USER,
      password: config.DB_HOST === 'localhost' ? '' : config.DB_PASSWORD,
      database: config.DB_NAME,
      port: config.DB_PORT,
    });

    connection.connect((err: any) => {
      err ? console.error(new Error(err)) : console.log("conectado con exito");
    });

    connection.on("err", (err: any) => {
      if (err) console.log(err);
    });

    return connection;
  }
}

export const dataBase = new Mysql().conectar();
