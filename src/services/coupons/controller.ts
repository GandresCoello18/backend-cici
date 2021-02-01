import { Request, Response } from 'express';
import { getCouponstUtil } from '../../utils/coupons';

export const getCoupons = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'favorite', serviceHandler: 'getCoupons' });
    req.logger.info({ status: 'start' });

    try {
        const coupons = await getCouponstUtil()

        return res.status(200).json({ coupons });
    } catch (error) {
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}