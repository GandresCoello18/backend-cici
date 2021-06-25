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

export const UploadReadAllNotificationUtil = async (idUser: string) => {
  try {
    return await new Promise((resolve, reject) => {
      dataBase.query(
        `UPDATE user_notification SET isRead = 1 WHERE idUser = '${idUser}';`,
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    });
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
