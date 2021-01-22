import { Request, Response } from 'express';

export const getUser = async (req: Request, res: Response) => {
    req.logger = req.logger.child({ service: 'users', serviceHandler: 'getUser' });
    req.logger.info({ status: 'start' });
  
    try {
      return res.status(200).json({ "username": "gangresCoello18" });
    } catch (error) {
      req.logger.error({ status: 'error', code: 404 });
      return res.status(404).json();
    }
  };