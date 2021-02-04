import { format, addMonths } from 'date-fns';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Locale from 'date-fns/locale/es'
import { CouponsUser } from '../../models/coupons';
import { createUserCouponsUtil, getCouponstUtil, getCouponsUsertUtil, getCoupontUtil, updateUserCouponsUtil } from '../../utils/coupons';
import { getUserUtil } from '../../utils';

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

export const getUserCoupons = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'Coupons', serviceHandler: 'getUserCoupons' });
    req.logger.info({ status: 'start' });

    try {
        const { status } = req.params
        const user = req.user
        let myCoupons = await getCouponsUsertUtil(user.idUser, status)

        const returnMyCoupons = await Promise.all(
            myCoupons.map(async cupon => {
                let user;
                if(cupon.idGuestUser){
                    user = await getUserUtil({idUser: cupon.idGuestUser})
                }

                let cupo;
                if(cupon.idCoupon){
                    cupo = await getCoupontUtil(cupon.idCoupon)
                }

                return {
                    id_user_coupons: cupon.id_user_coupons,
                    expiration_date: cupon.expiration_date,
                    created_at: cupon.created_at,
                    type: cupo ? cupo[0].type : null,
                    status: cupon.status,
                    userName: user ? user[0].userName : null,
                    avatar: user ? user[0].avatar : null,
                }
            })
        )

        if(returnMyCoupons.length){
            returnMyCoupons[0].created_at = format(new Date(returnMyCoupons[0].created_at), 'PPPP', {locale: Locale})
            returnMyCoupons[0].expiration_date = format(new Date(returnMyCoupons[0].expiration_date), 'PPPP', {locale: Locale})

            if(returnMyCoupons[0].created_at === returnMyCoupons[0].expiration_date){
                returnMyCoupons[0].expiration_date = 'No Expira'
            }
        }

        return res.status(200).json({ myCoupons: returnMyCoupons });
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
        let expire: Date = expiration_date ? new Date(expiration_date) : addMonths(new Date(), 1)

        const userCoupon: CouponsUser = {
            id_user_coupons: uuidv4(),
            idUser: idUser || null,
            idCoupon: idCoupon || null,
            expiration_date: format(expire, 'yyyy-MM-dd HH:mm:ss'),
            created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            idGuestUser: idGuestUser || user.idUser,
            status: 'No valido aun'
        }

        await createUserCouponsUtil(userCoupon)

        return res.status(200).json();
    } catch (error) {
        console.log(error.message)
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const updateUserCoupon = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'Coupons', serviceHandler: 'updateUserCoupon' });
    req.logger.info({ status: 'start' });

    try {
        const {id_user_coupons, idCoupon} = req.body
        const user = req.user

        if(!id_user_coupons || !idCoupon){
            const response = { status: 'No data idCoupon update coupons provided' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        await updateUserCouponsUtil(idCoupon, id_user_coupons, user.idUser)

        return res.status(200).json();
    } catch (error) {
        console.log(error.message)
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}
