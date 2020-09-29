const AccountModel = require("../../../../../../../models/AccountModel");
const ResponseCode = require("../../../../../../../constants/ResponseCode");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let wrongOTP = 0;
module.exports = async (request, reply) => {
    const { payload } = request;
    const hash = await bcrypt.hashSync(payload.password, 10);
    try {
      let account = await AccountModel.findOne({id: request.auth.credentials.userId});
      if (account){
        if (bcrypt.compareSync(payload.verifyCode, account.verifyCode) && wrongOTP < 3) {
            account = await AccountModel.updateOne({password: hash, verifyCode: null})
            if(account) {
                return reply.api({
                    success: request.i18n.__("Change Password Success")
                }).code(ResponseCode.REQUEST_SUCCESS);
            } 
            else return reply.api({ error: request.i18n.__("Cant Change Password")}).code(ResponseCode.REQUEST_FAIL)
        }
        else {
            if (wrongOTP < 3) {
                wrongOTP = wrongOTP + 1
                return reply.api({error: request.i18n.__("Wrong OTP")}).code(ResponseCode.REQUEST_FAIL) 
            }
            else { 
                await AccountModel.updateOne({verifyCode: null}) 
                await setTimeout(() => {
                    wrongOTP = wrongOTP - 3
                    console.log(wrongOTP)
                }, 30000)
                return reply.api({error: request.i18n.__("OTP Has Been Deleted")}).code(ResponseCode.REQUEST_FAIL) 
            }
        }
      }
      else {
        return reply.api({error: request.i18n.__("Cant find account")}).code(ResponseCode.REQUEST_FAIL)
      }
    } catch (error) {
        console.log(error)
      return reply
        .api({
          error: error,
        })
        .code(ResponseCode.REQUEST_FAIL);
    }
  };