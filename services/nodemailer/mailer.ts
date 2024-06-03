import path from "path";
import nodemailer from "nodemailer";
import { config } from "dotenv";
const handlebarsExpress = require("nodemailer-express-handlebars");

config(); // Load environment variables

interface Nodemailer {
  email: string;
  subject: string;
  template?: string;
  body: any;
}

const sendMail = async ({ email, subject, template, body }: Nodemailer) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const handlebarOptions = {
    viewEngine: {
      partialsDir: path.resolve("./views/"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./views/"),
  };

  transporter.use("compile", handlebarsExpress(handlebarOptions));

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    template: template,
    subject: subject,
    context: body,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.error("Error sending email:", error);
        reject(error);
      } else {
        console.log(`Email sent: ${info.response}`);
        resolve(info.response);
      }
    });
  });
};

export { sendMail };
