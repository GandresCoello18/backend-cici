import { dataBase } from "..";
import { OfferTime, OfferTimeProducts } from "../../models/offerTime";
import { Product } from "../../models/products";

export const NewOfferTimerUtil = async (OfferTime: OfferTime) => {
    try {
      return (await new Promise((resolve, reject) => {
        dataBase.query(
          `INSERT INTO offerTime (idOfferTime, created_at, finish_at, description, status_offer_time) VALUES ('${OfferTime.idOfferTime}', '${OfferTime.created_at}', '${OfferTime.finish_at}', '${OfferTime.description}', '${OfferTime.status_offer_time}');`,
          (err, data) => (err ? reject(err) : resolve(data)),
        );
      }));
    } catch (error) {
      console.log(error.message);
      return false;
    }
};

export const AddProductOfferTimeUtil = async (ProductOfferTime: OfferTimeProducts) => {
    try {
      return (await new Promise((resolve, reject) => {
        dataBase.query(
          `INSERT INTO offerTime_product (id_offerTime_product, idProduct, idOfferTime) VALUES ('${ProductOfferTime.id_offerTime_product}', '${ProductOfferTime.idProduct}', '${ProductOfferTime.idOfferTime}');`,
          (err, data) => (err ? reject(err) : resolve(data)),
        );
      }));
    } catch (error) {
      console.log(error.message);
      return false;
    }
};

export const ExistProductOfferTimeUtil = async (idProduct: string, idOfferTime: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT * FROM offerTime_product WHERE idProduct = '${idProduct}' AND idOfferTime = '${idOfferTime}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as OfferTimeProducts[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getOfferTimeUtil = async () => {
    try {
      return (await new Promise((resolve, reject) => {
        dataBase.query(
          `SELECT * FROM offerTime ORDER BY created_at DESC;`,
          (err, data) => (err ? reject(err) : resolve(data)),
        );
      })) as OfferTime[];
    } catch (error) {
      console.log(error.message);
      return [];
    }
};

export const getOfferTimeOnlyUtil = async (idOfferTime: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT * FROM offerTime WHERE idOfferTime = '${idOfferTime}' AND status_offer_time = 'active';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as OfferTime[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getProductsOfferTimeUtil = async (idOfferTime: string) => {
    try {
      return (await new Promise((resolve, reject) => {
        dataBase.query(
          `SELECT products.* FROM offerTime_product INNER JOIN products ON products.idProducts = offerTime_product.idProduct WHERE offerTime_product.idOfferTime = '${idOfferTime}';`,
          (err, data) => (err ? reject(err) : resolve(data)),
        );
      })) as Product[];
    } catch (error) {
      console.log(error.message);
      return [];
    }
};

export const editOfferTimeUtil = async (finish_at: string, description: string, idOfferTime: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `UPDATE offerTime SET finish_at = '${finish_at}', description = '${description}' WHERE idOfferTime = '${idOfferTime}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    }));
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const deleteOfferTimeUtil = async (idOfferTime: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `DELETE FROM offerTime WHERE idOfferTime = '${idOfferTime}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    }));
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const deleteProductOfferTimeUtil = async (idProduct: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `DELETE FROM offerTime_product WHERE idProduct = '${idProduct}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    }));
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const UpdateExpiredOfferTimeUtil = async () => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `UPDATE offerTime, offerTime_product, products SET offerTime.status_offer_time = 'disable', products.discount = 0, products.offer_expires_date = NULL WHERE NOW() >= offerTime.finish_at AND offerTime.status_offer_time = 'active' AND offerTime_product.idOfferTime = offerTime.idOfferTime AND products.idProducts = offerTime_product.idProduct;;`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    }));
  } catch (error) {
    console.log(error.message);
    return false;
  }
};