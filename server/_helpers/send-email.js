const nodemailer = require('nodemailer');

module.exports = sendEmail;

/**
 * Send Email Helper
 * 
 * The send email helper is a lightweight wrapper around the nodemailer module to simplify sending emails from anywhere in the application. 
 * It is used by the account service to send account verification and password reset emails.
 * 
 * @param {*} info - body sample 
 */
async function sendEmail({ to, subject, html, from = process.env.emailFrom }) {
    const transporter = nodemailer.createTransport({
        "host": process.env.smtp_host,
        "port": process.env.smtp_port,
        "auth": {
            "user": process.env.smtp_auth_user,
            "pass": process.env.smtp_auth_pass
        }
    });
    await transporter.sendMail({ from, to, subject, html });
}