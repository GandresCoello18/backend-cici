import { Combo, ComboProduct } from '../../models/combo';
import { dataBase } from '../database';

export const NewComboUtil = async (combo: Combo) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `INSERT INTO combo (idCombo, name, price, created_at, discount, active, sold) VALUES ('${combo.idCombo}', '${combo.name}', ${combo.price}, '${combo.created_at}', ${combo.discount}, ${combo.active}, ${combo.sold});`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const AddComboProductUtil = async (comboProduct: ComboProduct) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `INSERT INTO combo_product (idComboProduct, idCombo, idProduct) VALUES ('${comboProduct.idComboProduct}', '${comboProduct.idCombo}', '${comboProduct.idProduct}');`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const GetComboExistUtil = async (name: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(`SELECT * FROM combo WHERE name = '${name}';`, (err, data) =>
        err ? reject(err) : resolve(data),
      );
    })) as Combo[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const GetComboProductExistUtil = async (idCombo: string, idProduct: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT * FROM combo_product WHERE idCombo = '${idCombo}' AND idProduct = '${idProduct}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as ComboProduct[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const GetCombosUtil = async () => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(`SELECT * FROM combo ORDER BY created_at DESC;`, (err, data) =>
        err ? reject(err) : resolve(data),
      );
    })) as Combo[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const GetProductByComboUtil = async (idCombo: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT products.* FROM combo_product INNER JOIN products ON products.idProducts = combo_product.idProduct WHERE combo_product.idCombo = '${idCombo}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as Combo[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const DeleteComboUtil = async (idCombo: string) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(`DELETE FROM combo WHERE idCombo = '${idCombo}';`, (err, data) =>
        err ? reject(err) : resolve(data),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
