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

        if(!destination || !subject ){
          const response = { status: 'No data time message provided' };
          req.logger.warn(response);
          return res.status(400).json(response);
        }

        const user = await getUserUtil({ email: destination });

        if(user.length === 0){
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
        }

        await newTimeMessageUtil(message);
        console.log(subject);

        await SendEmail({
            to: destination,
            subject: 'Recupera tu contraseña | Cici beauty place',
            text:'',
            html: PasswordReset(message.id_time_message, message.life_minutes),
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

        if(!id_time_message ){
          const response = { status: 'No data id time message provided' };
          req.logger.warn(response);
          return res.status(400).json(response);
        }

        const message = await getTimeMessageUtil(id_time_message);

        if(message.length){
            const time = addMinutes(new Date(message[0].created_at), message[0].life_minutes)

            if(time.getTime() < new Date().getTime()){
              message[0].status = 'Expirado'
            }else{
              message[0].status = 'En progreso'
            }
        }

        return res.status(200).json({ message: message[0] || undefined });
    } catch (error) {
      req.logger.error({ status: 'error', code: 500 });
      return res.status(404).json();
    }
};