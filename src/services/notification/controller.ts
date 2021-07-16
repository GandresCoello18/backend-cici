import { format } from 'date-fns';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '../../models/notification';
import {
  getNotificationsUtil,
  NewNotificacionUtil,
  UpdateReadNotificationUtil,
  UploadReadAllNotificationUtil,
} from '../../utils/notification';

export const addNotification = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'notificacion', serviceHandler: 'addNotification' });
  req.logger.info({ status: 'start' });

  try {
    const { idUser, text, link, title } = req.body;
    const me = req.user;

    if (!me.isAdmin || me.isBanner) {
      const response = { status: 'No eres admin o estas bloqueado' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    if (!idUser || !text || !link || !title) {
      const response = { status: 'No id User or text or title provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const notificacion: Notification = {
      idNotification: uuidv4(),
      created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      idUser,
      text,
      title,
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

export const getNotifications = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'notificacion', serviceHandler: 'getNotifications' });
  req.logger.info({ status: 'start' });

  try {
    const me = req.user;

    const notifications = await getNotificationsUtil(me.idUser);

    return res.status(200).json({ notifications });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(500).json();
  }
};

export const ReadNotification = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'notificacion', serviceHandler: 'ReadNotification' });
  req.logger.info({ status: 'start' });

  try {
    const { idNotification } = req.params;

    if (!idNotification) {
      const response = { status: 'No id Notification provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    await UpdateReadNotificationUtil(idNotification);

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
