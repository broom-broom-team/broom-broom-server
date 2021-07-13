const nodemailer = require("nodemailer");

exports.generateSecret = () => {
  let randomNumber = "";
  for (let i = 0; i < 6; i++) {
    randomNumber += Math.floor(Math.random() * 10);
  }
  return Number(randomNumber);
};

exports.sendSecretMail = async (email, secretKey) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    host: "smtp.gmail.com",
    secure: false,
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: "🔒부름부름 회원가입 인증번호 발급🔒",
    html: `🔥🔥🔥인증번호는 <strong>${secretKey}</strong>입니다.🔥🔥🔥<br/>인증번호 입력칸에 입력해주세요!😄`,
  };

  await transporter.sendMail(mailOptions);
};
