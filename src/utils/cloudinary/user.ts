import cloudinary from 'cloudinary';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { RemoveFilesTemp } from '../removeFileTemp';

export const UploadAvatarUser = async (req: Request) => {
  const path = req.file.path;
  const uniqueFilename = `users/${uuidv4()}`;

  await cloudinary.v2.uploader.upload(path, { public_id: uniqueFilename, tags: `avatars` });

  RemoveFilesTemp();

  return uniqueFilename;
};
