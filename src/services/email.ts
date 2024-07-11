// import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import Logger from '../core/Logger';
dotenv.config();



export const sendMail = async ( to: string, subject: string = 'This is the default Subject',from: string='no-reply@meilong-ceramics.com', html: string = '') => {
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
        Sending mail\n
        From: ${from}\n
        To: ${to}\n
        Subject: ${subject}\n
        HTML: ${html}`);
    // transporter.sendMail(mailOptions, (error, info)=> {
    //     if (error) {
    //         Logger.error(error);
    //     } else {
    //         Logger.info('Email sent: ' + info.response);
    //     }
    // });
}