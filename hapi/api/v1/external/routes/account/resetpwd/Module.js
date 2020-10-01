const AccountModel = require("../../../../../../../models/AccountModel");
const ResponseCode = require("../../../../../../../constants/ResponseCode");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
module.exports = async (request, reply) => {
    const { payload } = request;
    const hash = await bcrypt.hashSync(payload.password, 10);
    try {
      let account = await AccountModel.findOne({id: request.auth.credentials.userId});
      if (account){
        if (bcrypt.compareSync(payload.verifyCode, account.verifyCode) && account.countWrongOTP < 3) {
            let changePassword = await account.updateOne({password: hash, verifyCode: null})
            if(changePassword) {
                return reply.api({
                    success: request.i18n.__("Change Password Success")
                }).code(ResponseCode.REQUEST_SUCCESS);
            } 
            else return reply.api({ error: request.i18n.__("Cant Change Password")}).code(ResponseCode.REQUEST_FAIL)
        }
        else {
            if (account.countWrongOTP < 3) {
                let counting = account.countWrongOTP + 1
                console.log(counting)
                await account.updateOne({countWrongOTP: counting}) 
                return reply.api({error: request.i18n.__("Wrong OTP")}).code(ResponseCode.REQUEST_FAIL) 
            }
            else { 
                await account.updateOne({verifyCode: null}) 
                await setTimeout( async() => {
                  await account.updateOne({countWrongOTP: 0})
                  console.log('Time Done')
                }, 300000)
                return reply.api({error: request.i18n.__("OTP Has Been Deleted, Wait 5 Min Dude")}).code(ResponseCode.REQUEST_FAIL) 
            }
        }
      }
      else {
        return reply.api({error: request.i18n.__("Cant find account")}).code(ResponseCode.REQUEST_FAIL)
      }
    } catch (error) {
      return reply
        .api({
          error: error,
        })
        .code(ResponseCode.REQUEST_FAIL);
    }
  };