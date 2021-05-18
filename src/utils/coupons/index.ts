import { CouponAmount, Coupons, CouponsAssing, CouponsUser, MyCouponsUser } from "../../models/coupons";
import { User } from "../../models/users";
import { dataBase } from "../database";

export const getCouponstUtil = async (option: {status?: string}) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT * FROM coupons ${option.status ? `WHERE status = '${option.status}'` : ''} ORDER BY type DESC;`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          }) as Coupons[];
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

export const getCoupontUtil = async (IdCoupon: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT * FROM coupons WHERE idCoupon = '${IdCoupon}' AND status = 'Active';`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as Coupons[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const getCouponsUsertUtil = async (IdUser: string, status: string, page: number) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT * FROM user_coupons WHERE idUser = '${IdUser}' AND status = '${status}' LIMIT ${page}, 5;`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as CouponsUser[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const getCouponsAssingtUtil = async (id_user_coupon: string | undefined, page: number) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT user_coupons.id_user_coupons, user_coupons.created_at, user_coupons.expiration_date, user_coupons.status, coupons.type, users.userName, users.avatar, invita.userName as user_name_invita, invita.avatar as user_avatar_invita FROM user_coupons LEFT JOIN users ON users.idUser = user_coupons.idUser LEFT JOIN coupons ON coupons.idCoupon = user_coupons.idCoupon LEFT JOIN users as invita ON user_coupons.idGuestUser = invita.idUser ${id_user_coupon ? `WHERE user_coupons.id_user_coupons = '${id_user_coupon}'` : ''} ORDER BY user_coupons.created_at DESC LIMIT ${page}, 15;`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as CouponsAssing[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const getCouponsAssingUserUtil = async () => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT COUNT(*) / 15 as totalAssing FROM user_coupons;`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as {totalAssing: number}[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const getCouponsUserFreetUtil = async (IdUser: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT * FROM user_coupons WHERE idUser = '${IdUser}';`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as MyCouponsUser[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const getCountCouponsUserUtil = async (IdUser: string, status: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT COUNT(*) / 5 as totalCoupons FROM user_coupons WHERE idUser = '${IdUser}' AND status = '${status}';`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as {totalCoupons: number}[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const getCouponsAmountUserUtil = async (IdUser: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT coupons.type, COUNT(coupons.type) as cantidad FROM user_coupons INNER JOIN coupons ON coupons.idCoupon = user_coupons.idCoupon WHERE user_coupons.idUser = '${IdUser}' AND user_coupons.status = 'Valido' GROUP BY coupons.type;`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as CouponAmount[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const getCouponsRewarUserUtil = async (IdUser: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT users.idUser, users.userName, users.email FROM user_coupons INNER JOIN users on users.idUser = user_coupons.idGuestUser WHERE user_coupons.idUser = '${IdUser}' AND user_coupons.status = 'Pendiente' GROUP BY users.idUser, users.userName, users.email;`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as User[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const updateCouponsRewarUserUtil = async (IdUser: string, idGuestUser: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `UPDATE user_coupons SET status = 'Usado' WHERE idUser = '${IdUser}' AND idGuestUser = '${idGuestUser}' AND status = 'Pendiente';`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        });
  } catch (error) {
      console.log(error.message);
      return false;
  }
}

export const createUserCouponsUtil = async (userCoupon: CouponsUser) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `INSERT INTO user_coupons (id_user_coupons, idUser, idCoupon, expiration_date, created_at, idGuestUser, status) VALUES ('${userCoupon.id_user_coupons}', ${userCoupon.idUser ? `'${userCoupon.idUser}'` : null}, ${userCoupon.idCoupon ? `'${userCoupon.idCoupon}'`: null}, '${userCoupon.expiration_date}', '${userCoupon.created_at}', ${userCoupon.idGuestUser ? `'${userCoupon.idGuestUser}'`: null}, '${userCoupon.status}')`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        });
  } catch (error) {
      console.log(error.message);
      return false;
  }
}

export const createCouponUtil = async (Coupon: Coupons) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `INSERT INTO coupons (idCoupon, type, descripcion, status, source) VALUES ('${Coupon.idCoupon}', '${Coupon.type}', '${Coupon.descripcion}', '${Coupon.status}', '${Coupon.source}')`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        });
  } catch (error) {
      console.log(error.message);
      return false;
  }
}

export const updateUserCouponsUtil = async (idCoupon: string, id_user_coupons: string, idUser: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `UPDATE user_coupons SET idCoupon = '${idCoupon}', status = 'Valido' WHERE id_user_coupons = '${id_user_coupons}' AND idUser = '${idUser}';`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        });
  } catch (error) {
      console.log(error.message);
      return false;
  }
}

export const updateStatusCouponsUtil = async (id_user_coupons: string, status: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `UPDATE user_coupons SET status = '${status}' WHERE id_user_coupons = '${id_user_coupons}';`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        });
  } catch (error) {
      console.log(error.message);
      return false;
  }
}

export const updateExpireCouponsUtil = async () => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `UPDATE user_coupons SET status = 'Expirado' WHERE status <> 'Expirado' AND expiration_date < NOW();`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        });
  } catch (error) {
      console.log(error.message);
      return false;
  }
}

export const DeleteCoupontUtil = async (idCoupon: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `DELETE FROM coupons WHERE idCoupon = '${idCoupon}';`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        });
  } catch (error) {
      console.log(error.message);
      return false;
  }
}