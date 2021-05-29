import { Combo } from '../../models/combo';
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
