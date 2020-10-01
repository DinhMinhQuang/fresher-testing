const ResponseCode = require('../../../../../../../constants/ResponseCode');
const AccountModel = require('../../../../../../../models/AccountModel');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generator = require("generate-password");
const nodemailer = require("nodemailer")
const emailOTP = generator.generate({
    length: 6,
    numbers: true,
    lowercase: false,
    uppercase: false
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
    const { payload } = request
    const hash = await bcrypt.hashSync(payload.password, 10);
    const hashVerify = await bcrypt.hashSync(emailOTP, 10)
    try {
        let checkClientIp = await AccountModel.find({ clientIp: request.clientIp })
        let account = await AccountModel.findOne({ username: payload.username })
        if (!account) {
            if (checkClientIp.length > 2) {
                account = new AccountModel(payload)
                account.verifyCode = hashVerify
                account.password = hash
                account.confirmed = false;
                account.clientIp = request.clientIp
                account = await AccountModel.create(account)
                if (!account) {
                    return reply.api({ error: error }).code(ResponseCode.REQUEST_FAIL);
                }
                else {
                    let token = jwt.sign({ id: account.id, phone: account.phone }, '123456', { algorithm: "HS256" })
                    const mailOption = {
                        from: 'noreply@gmail.com',
                        to: payload.email,
                        subject: 'Verify Code',
                        text: emailOTP
                    }
                    await transporter.sendMail(mailOption, (err, info) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Email sent: ' + info.response);
                            console.log(emailOTP)
                        }
                    })
                    return reply.api({
                        access_token: token,
                        message: request.i18n.__("You Register More Than 3 Account On This Ip, Your Verify Code Has Been Send To Your Account")
                    }).code(ResponseCode.REQUEST_SUCCESS);
                }
            }
            else {
                account = new AccountModel(payload)
                account.password = hash
                account.confirmed = true;
                account.clientIp = request.clientIp
                account = await AccountModel.create(account)
                if (!account) {
                    return reply.api({ error: error }).code(ResponseCode.REQUEST_FAIL);
                }
                else {
                    let token = jwt.sign({ id: account.id, phone: account.phone }, '123456', { algorithm: "HS256" })
                    return reply.api({ access_token: token }).code(ResponseCode.REQUEST_SUCCESS);
                }
            }
        }
        else {
            return reply.api({ error: request.i18n.__("Username Exist") }).code(ResponseCode.REQUEST_FAIL)
        }
    } catch (error) {
        return reply.api({
            error: error
        }).code(ResponseCode.REQUEST_FAIL);
    }
}