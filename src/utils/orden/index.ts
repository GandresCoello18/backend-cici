import { Orden } from "../../models/orden";
import { dataBase } from "../database";

export const createOrdenUtil = async (orden: Orden) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `INSERT INTO orden (idOrder, idCart, idUser, created_at, update_at, status, paymentMethod, shipping, discount, totalAmount, id_user_coupons, paymentId) VALUES ('${orden.idOrder}', '${orden.idCart}', '${orden.idUser}', '${orden.created_at}', '${orden.update_at}', '${orden.status}', ${orden.paymentMethod ? `'${orden.paymentMethod}'` : null}, '${orden.shipping}', '${orden.discount}', '${orden.totalAmount}', ${orden.id_user_coupons ? `'${orden.id_user_coupons}'` : null}, ${orden.paymentId ? `'${orden.paymentId}'` : null});`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          });
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const geteOrdenStatusUtil = async (idUser: string, status: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT idOrder, created_at, paymentMethod, paymentId, idCart FROM orden WHERE idUser = '${idUser}' AND status = '${status}' ORDER BY created_at DESC LIMIT 10;`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as Orden[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const geteOrdensUtil = async () => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT idOrder, idCart, idUser, created_at, update_at, paymentMethod, paymentId, shipping, discount, status, totalAmount, id_user_coupons FROM orden ORDER BY created_at DESC LIMIT 30;`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as Orden[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}