import { User } from '../../models/users';
import { dataBase } from '../database';

const response_campo =
  'idUser, userName, email, password, created_at, isAdmin, avatar, provider, phone, isBanner';

export const getUserUtil = async (option: {
  idUser?: string;
  email?: string;
  userName?: string;
  isAdmin?: boolean;
  email_and_username?: {
    email: string;
    userName: string;
  };
}) => {
  try {
    if (!option) {
      return [];
    }

    let user: User[] = [];
    let sql: string;

    if (option.idUser) {
      sql = `SELECT ${response_campo} FROM users WHERE idUser = '${option.idUser}';`;
    }

    if (option.email) {
      sql = `SELECT ${response_campo} FROM users WHERE email = '${option.email}';`;
    }

    if (option.userName) {
      sql = `SELECT ${response_campo} FROM users WHERE userName = '${option.userName}';`;
    }

    if (option.isAdmin) {
      sql = `SELECT ${response_campo} FROM users WHERE isAdmin = ${option.isAdmin};`;
    }

    if (option.email_and_username) {
      sql = `SELECT ${response_campo} FROM users WHERE userName = '${option.email_and_username.userName}' OR email = '${option.email_and_username.email}';`;
    }

    user = await new Promise((resolve, reject) =>
      dataBase.query(sql, (err, data) => (err ? reject(err) : resolve(data))),
    );

    return user;
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getUsersUtil = async (findUser?: string, page?: number) => {
  try {
    const findEmail = `WHERE email LIKE '%${findUser}%' OR userName LIKE '%${findUser}%'`;

    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT ${response_campo} FROM users ${
          findUser ? findEmail : ''
        } ORDER BY created_at DESC LIMIT ${page}, 15;`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as User[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getUserProviderUtil = async (email: string, provider: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT * FROM users WHERE email = '${email}' AND provider = '${provider}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as User[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getUserRandomUtil = async () => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT * FROM users WHERE isAdmin = 0 AND isBanner = 0 AND idUser IN (SELECT idUser FROM orden WHERE YEAR(created_at) = ${new Date().getFullYear()}) ORDER BY RAND() LIMIT 1;`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as User[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const createUserUtil = async (user: User) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `INSERT INTO users (idUser, userName, email, password, created_at, isAdmin, avatar, provider, phone, isBanner, ciciRank) VALUES ('${
          user.idUser
        }', '${user.userName}', '${user.email}', ${user.password ? `'${user.password}'` : null}, '${
          user.created_at
        }', ${user.isAdmin}, ${user.avatar ? `'${user.avatar}'` : null}, '${user.provider}', ${
          user.phone ? `${user.phone}` : null
        }, ${user.isBanner}, ${user.ciciRank});`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const updateUserUtil = async (
  userName: string,
  email: string,
  phone: number,
  idUser: string,
) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `UPDATE users SET userName = '${userName}', email = '${email}', phone = ${phone} WHERE idUser = '${idUser}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const updatePasswordUserUtil = async (password: string, idUser: string) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `UPDATE users SET password = '${password}' WHERE idUser = '${idUser}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const updateCiciRankUserUtil = async (addPts: number, idUser: string) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `UPDATE users SET ciciRank = ciciRank + ${addPts} WHERE idUser = '${idUser}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const updateAvatarUserUtil = async (avatar: string, idUser: string) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `UPDATE users SET avatar = '${avatar}' WHERE idUser = '${idUser}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const deleteUserUtil = async (idUser: string) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(`DELETE FROM users WHERE idUser = '${idUser}';`, (err, data) =>
        err ? reject(err) : resolve(data),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
