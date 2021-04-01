import { Shipping, ShippingCart } from "../../models/shipping";
import { dataBase } from "../database";

export const geteShippingByOrdenUtil = async (idOrder: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT * FROM shipping WHERE idOrder = '${idOrder}' ORDER BY created_at DESC;`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as Shipping[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const getShippingProductsUtil = async (idUser: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT shipping.*, cart.idCart FROM shipping INNER JOIN orden ON orden.idOrder = shipping.idOrder INNER JOIN cart ON cart.idCart = orden.idCart WHERE orden.idUser = '${idUser}' ORDER BY shipping.update_at DESC;`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as ShippingCart[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const getShippingUtil = async (idPago?: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT shipping.*, orden.paymentId, users.userName, users.avatar FROM shipping INNER JOIN orden ON orden.idOrder = shipping.idOrder INNER JOIN users ON users.idUser = orden.idUser ${idPago ? `WHERE orden.paymentId LIKE '%${idPago}%' OR shipping.guide LIKE '%${idPago}%'` : ''} ORDER BY shipping.created_at DESC;`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as Shipping[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const createShippingUtil = async (Shipping: Shipping) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `INSERT INTO shipping (idShipping, idOrder, created_at, status, guide, method, update_at) VALUES ('${Shipping.idShipping}', '${Shipping.idOrder}', '${Shipping.created_at}', '${Shipping.status}', ${Shipping.guide ? `'${Shipping.guide}'` : null}, ${Shipping.method ? `'${Shipping.method}'` : null}, '${Shipping.update_at}');`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        });
  } catch (error) {
      console.log(error.message);
      return false;
  }
}

export const updateStatusShippingUtil = async (status: string, idShipping: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `UPDATE shipping SET status = '${status}' WHERE idShipping = '${idShipping}';`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as Shipping[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}