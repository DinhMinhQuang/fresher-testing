const AccountModel = require("../../../../../../../models/AccountModel")
const ResponseCode = require("../../../../../../../constants/ResponseCode")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
var generator = require("generate-password")
const nodemailer = require("nodemailer")
const emailOTP = generator.generate({
  length: 6,
  numbers: true,
  uppercase: false,
  lowercase: false
});
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: false,
  auth: {
    user: "letuyettrinh10c12@gmail.com",
    pass: "Nguyenquean26102001`"
  }
});
module.exports = async (request, reply) => {
  const { payload } = request;
  try {
    let account = await AccountModel.findOne({ username: payload.username });
    const mailOption = {
      from: "noreply@gmail.com",
      to: account.email,
      subject: "Reset Password Code",
      text: emailOTP,
    };
    console.log(emailOTP)
    const hashOTP = await bcrypt.hashSync(emailOTP, 10)
    if (account) {
      let token = jwt.sign({ id: account.id, phone: account.phone }, '123456', { algorithm: "HS256" })
      await account.updateOne({ verifyCode: hashOTP })
      await transporter.sendMail(mailOption, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      return reply
        .api({ access_token: token, 
        message:  request.i18n.__("OTP Has Been Send For Your Email")})
        .code(ResponseCode.REQUEST_SUCCESS);
    } else {
      return reply
        .api({ error: request.i18n.__("Username don't Exist") })
        .code(ResponseCode.REQUEST_FAIL);
    }
  } catch (error) {
    return reply
      .api({
        error: error,
      })
      .code(ResponseCode.REQUEST_FAIL);
  }
};
