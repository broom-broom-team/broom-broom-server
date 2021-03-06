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
    subject: "πλΆλ¦λΆλ¦ νμκ°μ μΈμ¦λ²νΈ λ°κΈπ",
    html: `π₯π₯π₯μΈμ¦λ²νΈλ <strong>${secretKey}</strong>μλλ€.π₯π₯π₯<br/>μΈμ¦λ²νΈ μλ ₯μΉΈμ μλ ₯ν΄μ£ΌμΈμ!π`,
  };
  await transporter.sendMail(mailOptions);
};

exports.sendTempPassword = async (email, tempPassword) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: "πλΆλ¦λΆλ¦ μμ λΉλ°λ²νΈ λ°κΈπ",
    html: `ππμμλΉλ°λ²νΈλ <strong>${tempPassword}</strong>μλλ€.ππ<br/>λ°κΈλ°μ μμλΉλ°λ²νΈλ‘ λ‘κ·ΈμΈν΄μ£ΌμΈμ!π<br/>λΉλ°λ²νΈλ³κ²½μ λ§μ΄νμ΄μ§μμ ν  μ μμ΅λλ€.`,
  };
  await transporter.sendMail(mailOptions);
};
