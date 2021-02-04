import { Coupons, CouponsUser, MyCouponsUser } from "../../models/coupons";
import { dataBase } from "../database";

export const getCouponstUtil = async () => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT * FROM coupons WHERE status = 'Active';`,
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

export const getCouponsUsertUtil = async (IdUser: string, status: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT * FROM user_coupons WHERE idUser = '${IdUser}' AND status = '${status}';`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as CouponsUser[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const getCouponsUserFreetUtil = async (IdUser: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT * FROM user_coupons WHERE idUser = '${IdUser}' AND idGuestUser = Null;`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as MyCouponsUser[];
  } catch (error) {
      console.log(error.message);
      return [];
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
