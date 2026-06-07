const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const mailOptions = {
    from: '"ArrayStore Support" <noreply@arraystore.com>',
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  const info = await transporter.sendMail(mailOptions);

  
  console.log('========================================');
  console.log('📧 Email sent successfully!');
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  console.log('========================================');

  return info;
};

module.exports = sendEmail;
