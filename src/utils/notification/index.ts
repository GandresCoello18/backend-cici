import { dataBase } from '../database';
import { Notification } from '../../models/notification';

export const NewNotificacionUtil = async (notificacion: Notification) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `INSERT INTO user_notification (idNotification, idUser, created_at, link, text, isRead) VALUES ('${notificacion.idNotification}', '${notificacion.idUser}', '${notificacion.created_at}', '${notificacion.link}', '${notificacion.text}', ${notificacion.isRead});`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
