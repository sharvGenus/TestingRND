const nodemailer = require("nodemailer");

/**
 * Function is used to create the transport and send the mail
 * @param { object } smtpConfiguration
 * @param { object } emailTemplate
 * @returns
 */
const sendMail = (smtpConfiguration, emailTemplate) => {
    const { server, port, encryption, username, password } = smtpConfiguration;
    const { fromName, toEmail, ccEmail, bccEmail, subject, emailBody, attachments } = emailTemplate;
    const transport = nodemailer.createTransport({
        host: server,
        secure: false,
        ...(encryption && encryption === "TLS" && { secureConnection: false, tls: { ciphers: "SSLv3" } }),
        port: port,
        auth: {
            user: username,
            pass: password
        }
    });
    const message = {
        from: fromName ? `"${fromName}" <${username}>` : username,
        to: toEmail,
        ...(ccEmail && { cc: ccEmail }),
        ...(bccEmail && { bcc: bccEmail }),
        subject: subject,
        headers: {
            "X-Laziness-level": 1000,
            charset: "UTF-8"
        },
        html: emailBody,
        ...(attachments && { attachments: attachments })
    };

    return transport.sendMail(message);
};

module.exports = {
    sendMail
};
