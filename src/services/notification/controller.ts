import { format } from 'date-fns';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '../../models/notification';
import { NewNotificacionUtil, UploadReadAllNotificationUtil } from '../../utils/notification';

export const addNotification = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'notificacion', serviceHandler: 'addNotification' });
  req.logger.info({ status: 'start' });

  try {
    const { idUser, text, link } = req.body;
    const me = req.user;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!idUser || !text || !link) {
      const response = { status: 'No id User or text provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const notificacion: Notification = {
      idNotification: uuidv4(),
      created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      idUser,
      text,
      link,
      isRead: false,
    };

    await NewNotificacionUtil(notificacion);

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const ReadAllNotification = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'notificacion', serviceHandler: 'ReadAllNotification' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;

    await UploadReadAllNotificationUtil(me.idUser);

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};
