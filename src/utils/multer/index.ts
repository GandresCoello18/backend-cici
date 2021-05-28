/* eslint-disable @typescript-eslint/no-explicit-any */
import multer from 'multer';
import path from 'path';

export const storage = multer.diskStorage({
  destination: function (
    _req: Express.Request,
    _file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void,
  ) {
    // callback(null, "./public/uploads");
    callback(null, path.join(__dirname, '../../../public/uploads'));
  },
  filename: function (_req: Express.Request, file: any, callback: any) {
    callback(null, file.originalname);
  },
});
