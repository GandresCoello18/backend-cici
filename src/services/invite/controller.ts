import { Request, Response } from 'express';
import { SendEmail } from '../../utils/email/send';
import { Invitacion } from '../../utils/email/template/invite';

export const sendInvite = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'invite', serviceHandler: 'sendInvite' });
    req.logger.info({ status: 'start' });

    try {
      const user = req.user
      const { name, email } = req.body

      if(!name || !email){
        const response = { status: 'No provider name or email' };
        req.logger.warn(response);
        return res.status(400).json(response);
      }

      await SendEmail({
        to: email,
        subject: `Hola ${name}, acaba de recibir una invitacion de ${user.userName} para unirte a Cici beauty place`,
        text:'',
        html: Invitacion(user.userName, user.avatar || ''),
      });

      return res.status(200).json();
    } catch (error) {
      req.logger.error({ status: 'error', code: 500 });
      return res.status(404).json();
    }
};