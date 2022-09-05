
const nodeMailer = require('nodemailer');

module.exports.sendEmail = function sendEmail(subject, content, attachments) {
    let auth = {
        to: 'nguyenkim08@gmail.com',
       // cc: 'phult.contact@gmail.com,xuanlap93@gmail.com ',
        from: 'info.megaads@gmail.com',
        pass: 'pllmdcgimlyezayb',
        phone: '+841688120095'
    };

    let to = auth.to;
    let from = auth.from;
    let cc = auth.cc;
    let connection = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: auth.from,
            pass: auth.pass
        },
        logger: true
    };

    let transporter = nodeMailer.createTransport(connection);
    let mailOptions = {
        from: from,
        to: to,
        cc: cc,
        subject: subject, // Subject line
        text: content,
        attachments: attachments
    };

    // send mail
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
};
