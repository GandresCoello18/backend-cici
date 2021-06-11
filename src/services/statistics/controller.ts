/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import {
  getStatisticsOrdeAmountTotalUtil,
  getStatisticsOrdeAmountUtil,
  getStatisticsOrderMothUtil,
  getStatisticsOrderPaidUtil,
  getStatisticsOrderUtil,
  getStatisticsReceivedProductUtil,
  getStatisticsRecomendationProductUtil,
  getStatisticsShippingUtil,
  getStatisticsUserMothUtil,
  getStatisticsUserUtil,
} from '../../utils/statistics';

export const getStatistics = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'Statistics', serviceHandler: 'getStatistics' });
  req.logger.info({ status: 'start' });

  try {
    const { mesAno } = req.query;
    let date;

    if (mesAno) {
      date = (mesAno + '-01') as string;
    }
    const me = req.user;

    if (!me.isAdmin) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const Users = await getStatisticsUserUtil();
    const MothUsers = await getStatisticsUserMothUtil(date);
    const LasUsers = await getStatisticsUserMothUtil(date);

    const Orders = await getStatisticsOrderUtil();
    const MothOrdens = await getStatisticsOrderMothUtil(date);
    const LasOrdens = await getStatisticsOrderMothUtil(date);

    const OrdenPaid = await getStatisticsOrderPaidUtil();
    const Progress = await getStatisticsShippingUtil(OrdenPaid[0].total);

    const grafico = await getStatisticsOrdeAmountUtil(date);

    const Amount = await getStatisticsOrdeAmountTotalUtil(date);

    const statistics = {
      user: {
        user: Users[0].total || 0,
        totalUser: MothUsers[0].total || 0,
        totalLasUser: LasUsers[0].total || 0,
      },
      order: {
        order: Orders[0].total || 0,
        totalOrders: MothOrdens[0].total || 0,
        totalLasOrders: LasOrdens[0].total || 0,
      },
      task: {
        progress: Progress[0].total,
      },
      grafico: {
        fechas: grafico.map(item => item.fecha),
        ventas: grafico.map(item => item.totalAmount),
        comision: grafico.map(item => item.comision),
      },
      Amount: Amount[0].total || 0,
      ComisionAmount: grafico.reduce((total, b) => total + b.comision, 0).toFixed(2) || 0,
    };

    return res.status(200).json({ statistics });
  } catch (error) {
    console.log(error.message);
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const getStatisticsReviewProduct = async (req: Request, res: Response) => {
  req.logger = req.logger.child({
    service: 'Statistics',
    serviceHandler: 'getStatisticsReviewProduct',
  });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;
    const { idProduct } = req.params;

    if (!me.isAdmin) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const Received = await getStatisticsReceivedProductUtil(idProduct);
    const Recommendation = await getStatisticsRecomendationProductUtil(idProduct);

    const StatisticsReview = {
      Received,
      Recommendation,
    };

    return res.status(200).json({ StatisticsReview });
  } catch (error) {
    console.log(error.message);
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};
