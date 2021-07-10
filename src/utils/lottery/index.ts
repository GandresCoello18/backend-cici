import { dataBase } from '..';
import { Lottery } from '../../models/lottery';

export const CreateLotteryUtil = async (sorteo: Lottery) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `INSERT INTO lottery (idLottery, idCart, created_at, winnerUser, status, finish_at) VALUES ('${
          sorteo.idLottery
        }', '${sorteo.idCart}', '${sorteo.created_at}', NULL, '${sorteo.status}', ${
          sorteo.finish_at ? `'${sorteo.finish_at}'` : ''
        });`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const getLotterysUtil = async () => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(`SELECT * FROM lottery ORDER BY created_at DESC;`, (err, data) =>
        err ? reject(err) : resolve(data),
      );
    })) as Lottery[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getLotteryUtil = async (idLoterry: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(`SELECT * FROM lottery WHERE idLoterry = '${idLoterry}';`, (err, data) =>
        err ? reject(err) : resolve(data),
      );
    })) as Lottery[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const WinnerUserLotteryUtil = async (idUser: string, idLottery: string) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `UPDATE lottery SET winnerUser = '${idUser}', status = 'Complete' WHERE idLottery = '${idLottery}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const ResetLoteryUtil = async (idLottery: string) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `UPDATE lottery SET winnerUser = NULL, status = 'Pending' WHERE idLottery = '${idLottery}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
