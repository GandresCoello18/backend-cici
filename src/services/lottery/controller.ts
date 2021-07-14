import { Request, Response } from 'express';
import { Lottery } from '../../models/lottery';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import {
  CreateLotteryUtil,
  DeleteLoteryUtil,
  getLasNumberOfLotteryUtil,
  getLotterysUtil,
  getLotteryUtil,
  ResetLoteryUtil,
  WinnerUserLotteryUtil,
} from '../../utils/lottery';
import { getUserRandomUtil, getUserUtil } from '../../utils/users';
import { getProductCartUtil, getStatusCartUserUtil, UpdateStatusCart } from '../../utils/cart';
import { BASE_API_IMAGES_CLOUDINNARY_SCALE, DEFAULT_AVATAR } from '../../helpers/url';

export const newLottery = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'lottery', serviceHandler: 'newLottery' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;
    const { finishAt } = req.body;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres administrador o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!finishAt) {
      const response = { status: 'No provider finish At' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const existCart = await getStatusCartUserUtil(me.idUser, 'Pending');

    if (!existCart.length) {
      const response = { status: 'No hay productos en carrito' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const lasNumberLottery = await getLasNumberOfLotteryUtil();

    const sorteo: Lottery = {
      idLottery: uuidv4(),
      idCart: existCart[0].idCart,
      winnerUser: null,
      created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      finish_at: finishAt ? format(new Date(finishAt), 'yyyy-MM-dd HH:mm:ss') : null,
      status: 'Pending',
      numberOfLottery: lasNumberLottery.length ? lasNumberLottery[0].lasNumberOfLottery + 1 : 1,
    };

    await CreateLotteryUtil(sorteo);
    await UpdateStatusCart(sorteo.idCart, 'Complete');

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};

export const getLotterys = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'lottery', serviceHandler: 'getLotterys' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres administrador o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const sorteos = await getLotterysUtil();

    const lotterys = await Promise.all(
      sorteos.map(async sorteo => {
        let winner;

        const products = await getProductCartUtil(sorteo.idCart);

        sorteo.created_at = format(new Date(sorteo.created_at), 'yyyy-MM-dd HH:mm:ss');

        if (sorteo.finish_at) {
          sorteo.finish_at = format(new Date(sorteo.finish_at), 'yyyy-MM-dd HH:mm:ss');
        }

        if (sorteo.winnerUser) {
          const user = await getUserUtil({ idUser: sorteo.winnerUser });

          winner = {
            userName: user[0].userName,
            avatar: user[0].avatar || `${BASE_API_IMAGES_CLOUDINNARY_SCALE}/${DEFAULT_AVATAR}`,
            email: user[0].email,
          };
        }

        return {
          ...sorteo,
          products,
          winner,
        };
      }),
    );

    return res.status(200).json({ lotterys });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};

export const WinnerLotterys = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'lottery', serviceHandler: 'WinnerLotterys' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;
    const { idLoterry } = req.params;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres administrador o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!idLoterry) {
      const response = { status: 'No provider id Loterry' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const lottery = await getLotteryUtil(idLoterry);

    if (!lottery.length) {
      const response = { status: 'No find Loterry' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (lottery[0].winnerUser) {
      const response = { status: 'Este sorteo ya tiene un ganador' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (lottery[0].status === 'Pending' && !lottery[0].winnerUser) {
      const user = await getUserRandomUtil();
      await WinnerUserLotteryUtil(user[0].idUser, idLoterry);
      user[0].password = '';
      return res.status(200).json({ winner: user[0] });
    }

    return res.status(200).json({ winner: undefined });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};

export const resetLotterys = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'lottery', serviceHandler: 'resetLotterys' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;
    const { idLoterry } = req.params;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres administrador o estas bloqueado' };
      req.logger.warn(response);
      return res.status(401).json(response);
    }

    if (!idLoterry) {
      const response = { status: 'No provider id Loterry' };
      req.logger.warn(response);
      return res.status(500).json(response);
    }

    await ResetLoteryUtil(idLoterry);

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};

export const deleteLottery = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'lottery', serviceHandler: 'deleteLottery' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;
    const { idLoterry } = req.params;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres administrador o estas bloqueado' };
      req.logger.warn(response);
      return res.status(401).json(response);
    }

    if (!idLoterry) {
      const response = { status: 'No provider id Loterry' };
      req.logger.warn(response);
      return res.status(500).json(response);
    }

    await DeleteLoteryUtil(idLoterry);

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};
