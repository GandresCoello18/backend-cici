import { format } from 'date-fns';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Contact } from '../../models/contact';
import { dataBase } from '../../utils';

export const createNewSms = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'contact', serviceHandler: 'createNewSms' });
    req.logger.info({ status: 'start' });

    try {
        const {name, message, email, subject} = req.body

        const contactExit: Contact[] = await new Promise((resolve, reject) => {
            dataBase.query(
              `SELECT * FROM contact WHERE subject = '${subject}' AND email = '${email}' AND status = 'Pendiente';`,
              (err, data) => err ? reject(err) : resolve(data)
            );
        });

        if(contactExit.length === 0){
            const contact: Contact = {
                idContact: uuidv4(),
                status: 'Pendiente',
                name,
                message,
                email,
                subject,
                created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            }
    
            await new Promise((resolve, reject) => {
                dataBase.query(
                  `INSERT INTO contact (idContact, name, message, email, subject, created_at, status) VALUES ('${contact.idContact}', '${contact.name}', '${contact.message}', '${contact.email}', '${contact.subject}', '${contact.created_at}', '${contact.status}');`,
                  (err, data) => err ? reject(err) : resolve(data)
                );
            });
        }

        return res.status(200).json();
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}
