import { Request, Response } from 'express';
import { getProvincesUtil } from '../../utils/provinces';

export const getProvinces = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'provinces', serviceHandler: 'getProvinces' });
  req.logger.info({ status: 'start' });

  try {
    const provinces = await getProvincesUtil();

    return res.status(200).json({ provinces });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};
