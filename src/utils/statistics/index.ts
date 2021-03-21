import { StatisticUser } from "../../models/statistics";
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