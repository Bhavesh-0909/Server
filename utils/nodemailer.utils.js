const nodemailer = require('nodemailer');

const mailSender = async(email, title, body) =>{
    let transporter = nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
        }
    });

    let mail = await transporter.sendMail({
        from:"StudyNotion | Bhavesh Choudhary",
        to:`${email}`,
        subject:`${title}`,
        html:`${body}`
    })
}

module.exports = mailSender;