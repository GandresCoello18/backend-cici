import { User } from "../../models/users";
import { dataBase } from "../database";

let response_campo: string = 'idUser, userName, email, password, created_at, isAdmin, avatar, provider, phone, isBanner';

export const getUserUtil = async (option: {
    idUser?: string,
    email?: string,
    userName?: string,
    email_and_username?: {
        email: string,
        userName: string,
    }
}) => {
    try {

      if(!option){
        return []
      }

      let user: User[] = [];
      let sql: string;

      if(option.idUser) {
        sql = `SELECT ${response_campo} FROM users WHERE idUser = '${option.idUser}';`;
      }

      if(option.email) {
        sql = `SELECT ${response_campo} FROM users WHERE email = '${option.email}';`;
      }

      if(option.userName) {
        sql = `SELECT ${response_campo} FROM users WHERE userName = '${option.userName}';`;
      }

      if(option.email_and_username) {
        sql = `SELECT ${response_campo} FROM users WHERE userName = '${option.email_and_username.userName}' OR email = '${option.email_and_username.email}';`;
      }

      user = await new Promise((resolve, reject) => dataBase.query(
        sql, (err, data) => err ? reject(err) : resolve(data)
      ));

      return user;
    } catch (error) {
      console.log(error.message);
      return [];
    }
}

export const getUsersUtil = async () => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT ${response_campo} FROM users ORDER BY created_at DESC;`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        });
  } catch (error) {
      console.log(error.message);
      return false;
  }
}

export const createUserUtil = async (user: User) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `INSERT INTO users (idUser, userName, email, password, created_at, isAdmin, avatar, provider, phone, isBanner) VALUES ('${user.idUser}', '${user.userName}', '${user.email}', ${user.password ? `'${user.password}'` : null}, '${user.created_at}', ${user.isAdmin}, ${user.avatar ? `'${user.avatar}'` : null}, '${user.provider}', ${user.phone ? `${user.phone}` : null}, ${user.isBanner});`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          });
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const updateUserUtil = async (userName: string, email: string, phone: number, idUser: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `UPDATE users SET userName = '${userName}', email = '${email}', phone = ${phone} WHERE idUser = '${idUser}';`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        });
  } catch (error) {
      console.log(error.message);
      return false;
  }
}

export const updatePasswordUserUtil = async (password: string, idUser: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `UPDATE users SET password = '${password}' WHERE idUser = '${idUser}';`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        });
  } catch (error) {
      console.log(error.message);
      return false;
  }
}