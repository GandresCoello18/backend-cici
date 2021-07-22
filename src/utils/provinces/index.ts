import { dataBase } from '..';
import { Provinces } from '../../models/provinces';

export const getProvincesUtil = async () => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(`SELECT * FROM provinces WHERE active = 1 ORDER BY nombre ASC;`, (err, data) =>
        err ? reject(err) : resolve(data),
      );
    })) as Provinces[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getProvinceUtil = async (codeProvince: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT * FROM provinces WHERE active = 1 AND codeProvince = '${codeProvince}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as Provinces[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};
