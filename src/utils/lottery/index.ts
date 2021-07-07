import { dataBase } from '..';
import { Lottery } from '../../models/lottery';

export const CreateLotteryUtil = async (sorteo: Lottery) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `INSERT INTO lottery (idLottery, idCart, created_at, winnerUser, status) VALUES ('${sorteo.idLottery}', '${sorteo.idCart}', '${sorteo.created_at}', NULL, '${sorteo.status}');`,
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
