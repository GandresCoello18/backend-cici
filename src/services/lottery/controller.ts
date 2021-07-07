import { Request, Response } from 'express';
import { Lottery } from '../../models/lottery';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { CreateLotteryUtil } from '../../utils/lottery';

export const newLottery = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'lottery', serviceHandler: 'newLottery' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;
    const { idCart } = req.body;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres administrador o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!idCart) {
      const response = { status: 'No provider idCart' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const sorteo: Lottery = {
      idLottery: uuidv4(),
      idCart,
      winnerUser: null,
      created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      status: 'Pending',
    };

    await CreateLotteryUtil(sorteo);

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};
