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