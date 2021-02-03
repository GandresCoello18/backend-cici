import { format } from 'date-fns';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { CouponsUser } from '../../models/coupons';
import { createUserCouponsUtil, getCouponstUtil } from '../../utils/coupons';

export const getCoupons = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'Coupons', serviceHandler: 'getCoupons' });
    req.logger.info({ status: 'start' });

    try {
        const coupons = await getCouponstUtil()

        return res.status(200).json({ coupons });
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const createUserCoupons = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'Coupons', serviceHandler: 'createUserCoupons' });
    req.logger.info({ status: 'start' });

    try {
        const {idUser, idCoupon, expiration_date, idGuestUser} = req.body
        const user = req.user

        let date: Date = expiration_date ? new Date(expiration_date) : new Date

        const userCoupon: CouponsUser = {
            id_user_coupons: uuidv4(),
            idUser: idUser || null,
            idCoupon: idCoupon || null,
            expiration_date: format(date, 'yyyy-MM-dd HH:mm:ss'),
            created_at: format(date, 'yyyy-MM-dd HH:mm:ss'),
            idGuestUser: idGuestUser || user.idUser,
            status: 'Pendiente'
        }

        await createUserCouponsUtil(userCoupon)

        return res.status(200).json();
    } catch (error) {
        console.log(error.message)
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}
