import { format } from 'date-fns';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Contact } from '../../models/contact';
import { DeleteContactUtil, GetContactsUtil, GetCountContactsUtil, NewContactUtil, UpdateStatusContactUtil } from '../../utils/contact';
import { SendEmail } from '../../utils/email/send';

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

export const replyMessage = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'contact', serviceHandler: 'replyMessage' });
    req.logger.info({ status: 'start' });

    try {
        const {idContact, name, message, email, subject} = req.body

        if(!idContact || !name || !message || !email || !subject){
            const response = { status: 'No eres admin o estas bloqueado' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        await SendEmail({
            to: email,
            subject: `Hola ${name}, respondiendo a tu mensjae de: (${subject})`,
            text: message,
            html: ''
        });

        await UpdateStatusContactUtil(idContact, 'Respondido');

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
        const page = req.query.page as string;
        let pages = 0;
        let start = 0;

        if(!me.isAdmin || me.isBanner){
            const response = { status: 'No eres admin o estas bloqueado' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        if(Number(page)){
            const totalPages = await GetCountContactsUtil();
            pages = totalPages[0].pages

            if(Number(page) > 1){
              start = Math.trunc((Number(page) -1) * 15)
            }
        }

        const contact = await GetContactsUtil(start);

        return res.status(200).json({ contact, pages });
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const deleteSms = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'contact', serviceHandler: 'deleteSms' });
    req.logger.info({ status: 'start' });

    try {
        const me = req.user
        const { idContact } = req.params

        if(!me.isAdmin || me.isBanner){
            const response = { status: 'No eres admin o estas bloqueado' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        if(!idContact){
            const response = { status: 'No id Contact provider' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        await DeleteContactUtil(idContact);

        return res.status(200).json();
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}