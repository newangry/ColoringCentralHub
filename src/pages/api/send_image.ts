import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from "nodemailer";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const image = req.body.image;
    const email = req.body.email;

    const transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: 'no-reply',
        to: email,
        subject: "Coloring image",
        text: "Generated your coloring image",
        html: `<div style="max-width: 700px; margin: auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%; font-family: Arial, Helvetica, sans-serif;">
        <h2 style="text-align: center; text-transform: uppercase; color: teal;">Generated your coloring image</h2>
        <p><a href='${image}'>${image}</a></p>
      </div>`
    };

    const resp = await transport.sendMail(mailOptions);
    res.status(200).json('success');
}

