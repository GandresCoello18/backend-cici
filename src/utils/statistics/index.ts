import { StatisticGrafico, StatisticUser } from "../../models/statistics";
import { dataBase } from "../database";

const DentroDelMes = "created_at >= CONCAT(DATE_ADD(DATE_ADD(LAST_DAY(NOW()), INTERVAL 1 DAY),INTERVAL -1 MONTH), ' 00:00:00') AND created_at <= CONCAT(LAST_DAY(NOW()), ' 23:59:00')";

export const getStatisticsUserMothUtil = async () => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT COUNT(*) as total FROM users WHERE ${DentroDelMes};`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as StatisticUser[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const getStatisticsUserUtil = async () => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT COUNT(*) as total FROM users;`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          }) as StatisticUser[];
    } catch (error) {
        console.log(error.message);
        return [];
    }
  }

export const getStatisticsOrderMothUtil = async () => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT COUNT(*) as total FROM orden WHERE ${DentroDelMes};`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          }) as StatisticUser[];
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

export const getStatisticsOrderUtil = async () => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT COUNT(*) as total FROM orden;`,
              (err, data) => err ? reject(err) : resolve(data)
            );
          }) as StatisticUser[];
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

export const getStatisticsOrdeAmountTotalUtil = async () => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT SUM(totalAmount) as total FROM orden WHERE ${DentroDelMes};`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as StatisticUser[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const getStatisticsOrdeAmountUtil = async () => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT totalAmount, TRUNCATE(((totalAmount * 10) / 100), 2) as comision, DATE_FORMAT(created_at, "%M %d %Y") as fecha FROM orden WHERE ${DentroDelMes} ORDER BY created_at ASC;`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as StatisticGrafico[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const getStatisticsReceivedProductUtil = async (idProduct: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT COUNT(*) as total, received FROM productReviews WHERE idProduct = '${idProduct}' GROUP BY received;`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as any[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const getStatisticsRecomendationProductUtil = async (idProduct: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT COUNT(*) as total, recommendation FROM productReviews WHERE idProduct = '${idProduct}' GROUP BY	recommendation;`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as any[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}