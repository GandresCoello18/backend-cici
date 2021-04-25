import { format } from 'date-fns';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Contact } from '../../models/contact';
import { GetContactsUtil, NewContactUtil } from '../../utils/contact';

export const createSms = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'contact', serviceHandler: 'createSms' });
    req.logger.info({ status: 'start' });

    try {
        const {name, message, email, subject} = req.body

        const contact: Contact = {
            idContact: uuidv4(),
            status: 'Pendiente',
            name,
            message,
            email,
            subject,
            created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        }

        await NewContactUtil(contact);

        return res.status(200).json();
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const getSms = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'contact', serviceHandler: 'getSms' });
    req.logger.info({ status: 'start' });

    try {
        const me = req.user

        if(!me.isAdmin || me.isBanner){
            const response = { status: 'No eres admin o estas bloqueado' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        const contact = await GetContactsUtil();

        return res.status(200).json({ contact });
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}
