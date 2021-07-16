import { ProductHistory } from '../../models/productHistory';
import { Product } from '../../models/products';
import { dataBase } from '../database';

export const createProductHistoryUtil = async (history: ProductHistory) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `INSERT INTO productHistory (idProductHistory, idProduct, idUser, created_at, updated_at) VALUES ('${history.idProductHistory}', '${history.idProduct}', '${history.idUser}', '${history.created_at}', '${history.updated_at}');`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const existProductHistoryUtil = async (idProduct: string, idUser: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT * FROM productHistory WHERE idProduct = '${idProduct}' AND idUser = '${idUser}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as ProductHistory[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getProductHistoryUtil = async (idUser: string, limit?: number) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT products.idProducts, products.title, products.source FROM productHistory INNER JOIN products ON products.idProducts = productHistory.idProduct WHERE productHistory.idUser = '${idUser}' ORDER BY productHistory.updated_at DESC ${
          limit ? `LIMIT ${limit}` : ''
        };`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as Product[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const updateProductHistoryUtil = async (
  idProduct: string,
  idUser: string,
  updated_at: string,
) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `UPDATE productHistory SET updated_at = '${updated_at}' WHERE idProduct = '${idProduct}' AND idUser = '${idUser}');`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const DeleteProductHistoryUtil = async (idUser: string) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(`DELETE FROM productHistory WHERE idUser = '${idUser}';`, (err, data) =>
        err ? reject(err) : resolve(data),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const ExpiredProductHistoryUtil = async () => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `DELETE FROM productHistory WHERE MONTH(NOW())- MONTH(created_at) > 3;`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
