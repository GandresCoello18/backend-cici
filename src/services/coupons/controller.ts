import { format, addMonths } from 'date-fns';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Locale from 'date-fns/locale/es'
import { CouponsUser } from '../../models/coupons';
import { createUserCouponsUtil, getCouponsAmountUserUtil, getCouponsAssingtUtil, getCouponstUtil, getCouponsUsertUtil, getCoupontUtil, updateUserCouponsUtil } from '../../utils/coupons';
import { getUserUtil } from '../../utils';
import { SendEmail } from '../../utils/email/send';
import { Invitacion } from '../../utils/email/template/invite';

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
                    descripcion: cupo ? cupo[0].descripcion : null,
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

        const userInvite = await getUserUtil({idUser: idGuestUser});

        await SendEmail({
            from: userInvite[0].email,
            to: userInvite[0].email,
            subject: 'Invitación | Cici beauty place',
            text:'',
            html: Invitacion(user.userName, user.avatar || ''),
        });

        return res.status(200).json();
    } catch (error) {
        console.log(error.message)
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const getAssignAmountCouponsByUser = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'Coupons', serviceHandler: 'getAssignAmountCouponsByUser' });
    req.logger.info({ status: 'start' });

    try {
        const me = req.user;
        const { idUser } = req.params

        if(!me.isAdmin || me.isBanner){
            const response = { status: 'No eres Admin o estas bloqueado' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        if(!idUser){
            const response = { status: 'No id User provider' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        const CouponsAmountAssing = await getCouponsAmountUserUtil(idUser);

        return res.status(200).json({ CouponsAmountAssing });
    } catch (error) {
        console.log(error.message)
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}

export const getAssignCoupons = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'Coupons', serviceHandler: 'getAssignCoupons' });
    req.logger.info({ status: 'start' });

    try {
        const user = req.user;
        const id_user_coupon = req.query.id_user_coupon as string;

        if(!user.isAdmin || user.isBanner){
            const response = { status: 'No eres Admin o estas bloqueado' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        const Coupons = await getCouponsAssingtUtil(id_user_coupon || undefined);

        Coupons.map(cupon => cupon.created_at = format(new Date(cupon.created_at), 'yyyy-MM-dd'));
        Coupons.map(cupon => cupon.expiration_date = format(new Date(cupon.expiration_date), 'yyyy-MM-dd'));

        return res.status(200).json({ CouponsAssing: Coupons });
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
