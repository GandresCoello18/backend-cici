/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatisticGrafico, StatisticUser } from '../../models/statistics';
import { dataBase } from '../database';

const DentroDelMes = (date?: string) => {
  return `created_at >= CONCAT(DATE_ADD(DATE_ADD(LAST_DAY(${
    date ? `'${date}'` : 'NOW()'
  }), INTERVAL 1 DAY),INTERVAL -1 MONTH), ' 00:00:00') AND created_at <= CONCAT(LAST_DAY(${
    date ? `'${date}'` : 'NOW()'
  }), ' 23:59:59')`;
};

export const getStatisticsUserMothUtil = async (date?: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT COUNT(*) as total FROM users WHERE ${DentroDelMes(date)};`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as StatisticUser[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getStatisticsUserUtil = async () => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(`SELECT COUNT(*) as total FROM users;`, (err, data) =>
        err ? reject(err) : resolve(data),
      );
    })) as StatisticUser[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getStatisticsOrderMothUtil = async (date?: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT COUNT(*) as total FROM orden WHERE ${DentroDelMes(date)};`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as StatisticUser[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getStatisticsOrderUtil = async () => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(`SELECT COUNT(*) as total FROM orden;`, (err, data) =>
        err ? reject(err) : resolve(data),
      );
    })) as StatisticUser[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getStatisticsOrderPaidUtil = async () => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(`SELECT COUNT(*) as total FROM orden WHERE status = 'Paid';`, (err, data) =>
        err ? reject(err) : resolve(data),
      );
    })) as StatisticUser[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getStatisticsShippingUtil = async (countOrden: number) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT TRUNCATE(((COUNT(*) / ${countOrden}) * 100), 2) as total FROM shipping;`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as StatisticUser[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getStatisticsOrdeAmountTotalUtil = async (date?: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT SUM(totalAmount) as total FROM orden WHERE ${DentroDelMes(
          date,
        )} AND status = 'Paid';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as StatisticUser[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getStatisticsOrdeAmountUtil = async (date?: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT totalAmount, TRUNCATE(((totalAmount * 12) / 100), 2) as comision, DATE_FORMAT(created_at, "%M %d %Y") as fecha FROM orden WHERE ${DentroDelMes(
          date,
        )} AND status = 'Paid' ORDER BY created_at ASC;`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as StatisticGrafico[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getStatisticsReceivedProductUtil = async (idProduct: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT COUNT(*) as total, received FROM productReviews WHERE idProduct = '${idProduct}' GROUP BY received;`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as any[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getStatisticsRecomendationProductUtil = async (idProduct: string) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `SELECT COUNT(*) as total, recommendation FROM productReviews WHERE idProduct = '${idProduct}' GROUP BY	recommendation;`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    })) as any[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};
