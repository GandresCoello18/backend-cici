import { Request, Response } from 'express';
import { format, endOfMonth, startOfMonth, subMonths } from 'date-fns';
import { getStatisticsOrderMothUtil, getStatisticsOrderUtil, getStatisticsUserMothUtil, getStatisticsUserUtil } from '../../utils/statistics';

export const getStatistics = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'Statistics', serviceHandler: 'getStatistics' });
    req.logger.info({ status: 'start' });

    try {
        const me = req.user

        if(!me.isAdmin || me.isBanner){
            const response = { status: 'No eres admin o estas bloqueado' };
            req.logger.warn(response);
            return res.status(400).json(response);
        }

        const InitialDate = format(startOfMonth(new Date()), 'yyyy-MM-dd');
        const FinishDate = format(new Date(endOfMonth(new Date())), 'yyyy-MM-dd');

        const LastInitialDate = format(subMonths(new Date(InitialDate), 1), 'yyyy-MM-dd');
        const LastFinishDate = format(subMonths(new Date(FinishDate), 1), 'yyyy-MM-dd');

        const Users = await getStatisticsUserUtil();
        const MothUsers = await getStatisticsUserMothUtil(InitialDate, FinishDate);
        const LasUsers = await getStatisticsUserMothUtil(LastInitialDate, LastFinishDate);

        const Orders = await getStatisticsOrderUtil();
        const MothOrdens = await getStatisticsOrderMothUtil(InitialDate, FinishDate);
        const LasOrdens = await getStatisticsOrderMothUtil(LastInitialDate, LastFinishDate);

        const statistics = {
            user: {
                user: Users[0].total || 0,
                totalUser: MothUsers[0].total || 0,
                totalLasUser: LasUsers[0].total || 0,
            },
            order: {
                order: Orders[0].total || 0,
                totalOrders: MothOrdens[0].total || 0,
                totalLasOrders: LasOrdens[0].total || 0,
            }
        }

        return res.status(200).json({ statistics });
    } catch (error) {
        console.log(error.message)
        req.logger.error({ status: 'error', code: 500 });
        return res.status(500).json();
    }
}