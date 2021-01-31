import { format } from 'date-fns';
import { Request, Response } from 'express';
import Locale from 'date-fns/locale/es'
import { v4 as uuidv4 } from 'uuid';
import { Addresses } from '../../models/addresses';
import { createAddressUtil, ExistAddressUtil, getMyAddressUtil } from '../../utils/addresses';

export const newAddress = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'addresses', serviceHandler: 'newAddress' });
    req.logger.info({ status: 'start' });

    try {
        const {title, phone, city, postalCode, address, idUser} = req.body

        if(!title || !phone || !city || !address){
            const response = { status: 'No data provided for new Address' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        const newAddress: Addresses = {
            idAddresses: uuidv4(),
            title,
            phone,
            city,
            postalCode,
            address,
            idUser: idUser || null,
            created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            selected: false
        }

        const existAddress = await ExistAddressUtil(newAddress.title)

        if(existAddress.length){
            const response = { status: 'Esta direccion ya existe' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }else{
            await createAddressUtil(newAddress)
            return res.status(200).json({address: newAddress});
        }

    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const getMyAddress = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'addresses', serviceHandler: 'getMyAddress' });
    req.logger.info({ status: 'start' });

    try {
        const user = req.user
        const address = await getMyAddressUtil(user.idUser)

        address[0].created_at = format(new Date(user.created_at), 'PPPP', {locale: Locale})
        address[0].idUser = ''

        return res.status(200).json({ address });
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}
