import nodemailer from 'nodemailer';
import {config} from '../config';

export const SendEmail = async (option: {from: string; to: string; subject: string; text: string; html: string}) => {
    try {
        console.log("ENVIANDO MENSAJE.........");

        await nodemailer.createTestAccount();

        const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        service: "gmail",
        requireTLS: true,
        secure: true, // true for 465, false for other ports
        tls: { rejectUnauthorized: false },
        auth: {
            user: config.CORREO_NAMECHEAP, // generated ethereal user
            pass: config.CLAVE_NAMECHEAP, // generated ethereal password
        },
        });

        const info = await transporter.sendMail({
        from: `${option.from}`, // sender address
        to: `${option.to}`, // list of receivers
        subject: `${option.subject}`, // Subject line
        text: `${option.text}`, // plain text body
        html: `${option.html}`,
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return true;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}