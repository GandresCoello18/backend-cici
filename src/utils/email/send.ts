import nodemailer from 'nodemailer';
import { config } from '../config';

export const SendEmail = async (option: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) => {
  try {
    console.log('ENVIANDO MENSAJE.........');

    await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'mail.privateemail.com',
      port: 465,
      secure: true,
      auth: {
        user: config.CORREO_NAMECHEAP, // generated ethereal user
        pass: config.CLAVE_NAMECHEAP, // generated ethereal password
      },
    });

    const info = await transporter.sendMail({
      from: `${config.CORREO_NAMECHEAP}`, // sender address
      to: `${option.to}`, // list of receivers
      subject: `${option.subject} | Cici beauty place`, // Subject line
      text: `${option.text}`, // plain text body
      html: `${option.html}`,
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
