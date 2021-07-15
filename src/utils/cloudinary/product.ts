/* eslint-disable @typescript-eslint/no-explicit-any */
import cloudinary from 'cloudinary';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { RemoveFilesTemp } from '../removeFileTemp';

export const UploasProduct = async (req: Request) => {
  const path = req.file.path;
  const uniqueFilename = `products/${uuidv4()}`;

  await cloudinary.v2.uploader.upload(path, { public_id: uniqueFilename, tags: `products` });

  RemoveFilesTemp();

  return uniqueFilename;
};

export const DeleteProduct = async (req: Request) => {
  const { public_id } = req.query;

  await cloudinary.v2.uploader.destroy(public_id as string, result => console.log(result));

  return true;
};

export const UploadMoreSourcesProduct = async (req: Request | any) => {
  const result: string[] = [];

  if (req.files.length) {
    for (let i = 0; i < req.files.length; i++) {
      const item = req.files[i];
      const path = item.path;
      const uniqueFilename = `more-sources/${uuidv4()}`;

      await cloudinary.v2.uploader.upload(path, {
        public_id: uniqueFilename,
        tags: `more-sources`,
      });

      result.push(uniqueFilename);
    }
  }

  RemoveFilesTemp();

  return result;
};
