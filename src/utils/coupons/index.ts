import { Coupons, CouponsUser, MyCouponsUser } from "../../models/coupons";
import { dataBase } from "../database";

export const getCouponstUtil = async () => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT * FROM coupons;`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          }) as Coupons[];
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

export const getCouponsUsertUtil = async (IdUser: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT user_coupons.id_user_coupons, user_coupons.expiration_date, user_coupons.created_at, user_coupons.status, coupons.type, users.userName, users.avatar FROM user_coupons INNER JOIN users ON users.idUser = user_coupons.idGuestUser INNER JOIN coupons ON coupons.idCoupon = user_coupons.idCoupon WHERE user_coupons.idUser = '${IdUser}';`,
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
            `INSERT INTO user_coupons (id_user_coupons, idUser, idCoupon, expiration_date, created_at, idGuestUser, status) VALUES ('${userCoupon.id_user_coupons}', ${userCoupon.idUser ? `'${userCoupon.idUser}'` : null}, ${userCoupon.idCoupon ? `'${userCoupon.idCoupon}'`: null}, '${userCoupon.expiration_date}', '${userCoupon.created_at}', '${userCoupon.idGuestUser}', '${userCoupon.status}')`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        });
  } catch (error) {
      console.log(error.message);
      return false;
  }
}