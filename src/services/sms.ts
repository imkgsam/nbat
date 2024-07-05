import dotenv from "dotenv";
import Logger from '../core/Logger';
dotenv.config();



export const sendSMSText = async ( to: string, message: string = 'This is a default sms message') => {
    // const transporter = nodemailer.createTransport({
    //     service: process.env.MAIL_HOST,
    //     auth: {
    //         user: process.env.MAIL_USERNAME,
    //         pass: process.env.MAIL_PASSWORD
    //     }
    // });
    // const mailOptions = {
    //     from: from,
    //     to: to,
    //     subject: subject,
    //     html: html
    // };
    Logger.info(`
        Sending SMS message\n
        To: ${to}\n
        Message: ${message}\n`);
    // transporter.sendMail(mailOptions, (error, info)=> {
    //     if (error) {
    //         Logger.error(error);
    //     } else {
    //         Logger.info('Email sent: ' + info.response);
    //     }
    // });
}