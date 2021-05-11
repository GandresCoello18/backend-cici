import { format } from 'date-fns';
import { Request, Response } from 'express';
import Locale from 'date-fns/locale/es'
import { v4 as uuidv4 } from 'uuid';
import { Addresses } from '../../models/addresses';
import { createAddressUtil, deleteMyAddressUtil, ExistAddressUtil, getMyAddressUtil, getSelectAddressUtil, updateSelectAddressUtil } from '../../utils/addresses';

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

        const AddresByUser = await getMyAddressUtil(idUser)

        if(AddresByUser.length > 3){
            const response = { status: 'Solo peudes registrar un limite de 3 direcciones' };
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

        const existAddress = await ExistAddressUtil(newAddress.title, idUser)

        if(existAddress.length){
            const response = { status: 'Esta direccion ya existe' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        if(AddresByUser.length === 0){
            newAddress.selected = true;
        }

        await createAddressUtil(newAddress)
        return res.status(200).json({address: newAddress});

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

        if(address.length){
            address.map(item => item.created_at = format(new Date(item.created_at), 'PPPP', {locale: Locale}))
        }

        return res.status(200).json({ address });
    } catch (error) {
        console.log(error.message)
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const getAddressByUser = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'addresses', serviceHandler: 'getAddressByUser' });
    req.logger.info({ status: 'start' });

    try {
        const { idUser } = req.params

        if(!idUser){
            const response = { status: 'No data provided id User for Address' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        const address = await getMyAddressUtil(idUser)

        if(address.length){
            address.map(item => item.created_at = format(new Date(item.created_at), 'PPPP', {locale: Locale}))
        }

        return res.status(200).json({ address });
    } catch (error) {
        console.log(error.message)
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const deleteMyAddress = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'addresses', serviceHandler: 'deleteMyAddress' });
    req.logger.info({ status: 'start' });

    try {
        const { title } = req.params
        const user = req.user

        if(!title){
            const response = { status: 'No data provided for delete Address' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        await deleteMyAddressUtil(user.idUser, title)

        return res.status(200).json();
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const selectedAddress = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'addresses', serviceHandler: 'selectedAddress' });
    req.logger.info({ status: 'start' });

    try {
        const { title } = req.params
        const user = req.user

        if(!title){
            const response = { status: 'No data provided for selectd Address' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        const selectdAddress = await getSelectAddressUtil(user.idUser, title)
        const isSelected: boolean = selectdAddress[0].selected ? false : true
        await updateSelectAddressUtil(user.idUser, title, isSelected)

        return res.status(200).json();
    } catch (error) {
        console.log(error.message)
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}
