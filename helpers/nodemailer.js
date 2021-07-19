const nodemailer = require("nodemailer");

exports.generateSecret = () => {
  let randomNumber = "";
  for (let i = 0; i < 6; i++) {
    randomNumber += Math.floor(Math.random() * 8 + 1);
  }
  return Number(randomNumber);
};

exports.generatePassword = () => {
  const { adjectives, nouns } = require("../utils/words");
  const randomNumber = Math.floor(Math.random() * adjectives.length);
  return `${adjectives[randomNumber]} ${nouns[randomNumber]}`;
};

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

exports.sendSecretMail = async (email, secretKey) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: "🔒부름부름 회원가입 인증번호 발급🔒",
    html: `🔥🔥🔥인증번호는 <strong>${secretKey}</strong>입니다.🔥🔥🔥<br/>인증번호 입력칸에 입력해주세요!😄`,
  };
  await transporter.sendMail(mailOptions);
};

exports.sendTempPassword = async (email, tempPassword) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: "🔒부름부름 임시 비밀번호 발급🔒",
    html: `🚀🚀임시비밀번호는 <strong>${tempPassword}</strong>입니다.🚀🚀<br/>발급받은 임시비밀번호로 로그인해주세요!😄<br/>비밀번호변경은 마이페이지에서 할 수 있습니다.`,
  };
  await transporter.sendMail(mailOptions);
};
