import { Orden } from '../../models/orden';
import { dataBase } from '../database';

export const createOrdenUtil = async (orden: Orden) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `INSERT INTO orden (idOrder, idCart, idUser, created_at, update_at, status, paymentMethod, shipping, discount, totalAmount, id_user_coupons, paymentId, qualified, numberOfOrder, subTotal, idCombo) VALUES ('${
          orden.idOrder
        }', ${orden.idCart ? `'${orden.idCart}'` : null}, '${orden.idUser}', '${
          orden.created_at
        }', '${orden.update_at}', '${orden.status}', ${
          orden.paymentMethod ? `'${orden.paymentMethod}'` : null
        }, '${orden.shipping}', ${orden.discount}, ${orden.totalAmount}, ${
          orden.id_user_coupons ? `'${orden.id_user_coupons}'` : null
        }, ${orden.paymentId ? `'${orden.paymentId}'` : null}, ${orden.qualified}, ${
          orden.numberOfOrder
        }, ${orden.subTotal}, ${orden.idCombo ? `'${orden.idCombo}'` : null});`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const UpdateQualifledOrdenUtil = async (idOrder: string, qualified: boolean) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `UPDATE orden SET qualified = ${qualified} WHERE idOrder = '${idOrder}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as Orden[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const UpdateStatusOrdenUtil = async (idOrder: string, status: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `UPDATE orden SET status = '${status}' WHERE idOrder = '${idOrder}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as Orden[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const Update_atOrdenUtil = async (idOrder: string, update_at: string | Date) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `UPDATE orden SET update_at = '${update_at}' WHERE idOrder = '${idOrder}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as Orden[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const geteOrdenUtil = async (idOrder: string, status: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT * FROM orden WHERE idOrder = '${idOrder}' AND status = '${status}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as Orden[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const geteOrdenStatusUtil = async (idUser: string, status: string, page: number) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT idOrder, created_at, paymentMethod, paymentId, shipping, discount, totalAmount, idCart, numberOfOrder FROM orden WHERE idUser = '${idUser}' AND status = '${status}' ORDER BY created_at DESC LIMIT ${page}, 5;`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as Orden[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const geteOrdensUtil = async (idPago?: string, page?: number) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT idOrder, idCart, idUser, created_at, update_at, paymentMethod, paymentId, shipping, discount, status, totalAmount, id_user_coupons, numberOfOrder FROM orden ${
          idPago ? `WHERE paymentId = '${idPago}'` : ''
        } ORDER BY created_at DESC LIMIT ${page}, 15;`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as Orden[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const geteOrdensByUserUtil = async (idUser: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT idOrder, idCart, idUser, created_at, update_at, paymentMethod, paymentId, shipping, discount, status, totalAmount, id_user_coupons FROM orden WHERE idUser = '${idUser}' ORDER BY created_at DESC LIMIT 30;`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as Orden[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getCountOrdensByUserUtil = async (idUser: string, status: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT COUNT(*) / 5 FROM orden WHERE idUser = '${idUser}' AND status = '${status}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as { totalOrden: number }[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getLasNmberOfOrdenUtil = async () => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(`SELECT MAX(numberOfOrder) as lasNumberOfOrder  FROM orden`, (err, data) =>
        err ? reject(err) : resolve(data),
      );
    })) as { lasNumberOfOrder: number }[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};
