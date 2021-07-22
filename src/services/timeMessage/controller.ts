import { addMinutes, format } from 'date-fns';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { TimeMessage } from '../../models/time-message';
import { getUserUtil } from '../../utils';
import { SendEmail } from '../../utils/email/send';
import { PasswordReset } from '../../utils/email/template/password-reset';
import { getTimeMessageUtil, newTimeMessageUtil } from '../../utils/time-message';

export const newTimeMessage = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'time-message', serviceHandler: 'newTimeMessage' });
  req.logger.info({ status: 'start' });

  try {
    const { destination, subject } = req.body;

    if (!destination || !subject) {
      const response = { status: 'No data time message provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const user = await getUserUtil({ email: destination });

    if (user.length === 0) {
      const response = { status: 'No exist email database' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const message: TimeMessage = {
      id_time_message: uuidv4(),
      destination,
      subject,
      created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      life_minutes: 10,
    };

    await newTimeMessageUtil(message);

    await SendEmail({
      to: destination,
      subject: 'Recupera tu contraseña',
      text: '',
      html: PasswordReset(message.id_time_message, message.life_minutes),
    });

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};

export const resendTimeMessage = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'time-message', serviceHandler: 'resendTimeMessage' });
  req.logger.info({ status: 'start' });

  try {
    const { idTimeMessage } = req.body;

    if (!idTimeMessage) {
      const response = { status: 'No data id time message provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const time = await getTimeMessageUtil(idTimeMessage);

    if (time.length === 0) {
      const response = { status: 'No exist time database' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const message: TimeMessage = {
      id_time_message: uuidv4(),
      destination: time[0].destination,
      subject: time[0].subject,
      created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      life_minutes: 30,
    };

    await newTimeMessageUtil(message);

    let html = '';

    if (message.subject === 'Recuperar contraseña') {
      html = PasswordReset(message.id_time_message, message.life_minutes);
    } else if (message.subject === '') {
      console.log('va otro');
    }

    if (!html) {
      const response = { status: 'No exist template email' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    await SendEmail({
      to: message.destination,
      subject: message.subject,
      text: '',
      html,
    });

    return res.status(200).json();
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};

export const getTimeMessage = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'time-message', serviceHandler: 'getTimeMessage' });
  req.logger.info({ status: 'start' });

  try {
    const { id_time_message } = req.params;

    if (!id_time_message) {
      const response = { status: 'No data id time message provided' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const message = await getTimeMessageUtil(id_time_message);

    if (message.length) {
      if (message[0]?.life_minutes) {
        const time = addMinutes(new Date(message[0].created_at), message[0].life_minutes);
        const calculeTime = time.getTime() < new Date().getTime();

        calculeTime ? (message[0].status = 'Expirado') : (message[0].status = 'En progreso');

        return res.status(200).json({ message: message[0] || undefined });
      }

      message[0].status = 'En progreso';
      return res.status(200).json({ message: message[0] || undefined });
    }
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};
