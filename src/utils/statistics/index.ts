import { StatisticGrafico, StatisticUser } from "../../models/statistics";
import { dataBase } from "../database";

export const getStatisticsUserMothUtil = async (InitiañDate: string, FinishDate: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT COUNT(*) as total FROM users WHERE created_at >= '${InitiañDate}' AND created_at <= '${FinishDate}';`,
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

export const getStatisticsOrderMothUtil = async (InitiañDate: string, FinishDate: string) => {
    try {
        return await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT COUNT(*) as total FROM orden WHERE created_at >= '${InitiañDate}' AND created_at <= '${FinishDate}';`,
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

export const getStatisticsOrdeAmountTotalUtil = async (InitiañDate: string, FinishDate: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT SUM(totalAmount) as total FROM orden WHERE created_at >= '${InitiañDate}' AND created_at <= '${FinishDate}';`,
            (err, data) => err ? reject(err) : resolve(data)
          );
        }) as StatisticUser[];
  } catch (error) {
      console.log(error.message);
      return [];
  }
}

export const getStatisticsOrdeAmountUtil = async (InitiañDate: string, FinishDate: string) => {
  try {
      return await new Promise((resolve, reject) => {
          dataBase.query(
            `SELECT totalAmount, TRUNCATE(((totalAmount * 10) / 100), 2) as comision, DATE_FORMAT(created_at, "%M %d %Y") as fecha FROM orden WHERE created_at >= '${InitiañDate}' AND created_at <= '${FinishDate}' ORDER BY created_at ASC;`,
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