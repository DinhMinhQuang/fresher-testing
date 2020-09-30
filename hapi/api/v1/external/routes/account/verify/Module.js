const ResponseCode = require('../../../../../../../constants/ResponseCode');
const AccountModel = require('../../../../../../../models/AccountModel');
const bcrypt = require("bcrypt");

module.exports = async (request, reply) => {
    const {payload} = request
    try {
        let account = await AccountModel.findOne({id: request.auth.credentials.userId})
        if (!account) {
            return reply.api({error: request.i18n.__("Cant Find")}).code(ResponseCode.REQUEST_FAIL)
        }
        else {
            if (bcrypt.compareSync(payload.verifyCode, account.verifyCode)) {
                await account.updateOne({confirmed: true, verifyCode: null}) 
                return reply.api({success: request.i18n.__("Account Has Been Verified")}).code(ResponseCode.REQUEST_SUCCESS)
            }
            else { 
                return reply.api({error: request.i18n.__("Wrong Verify Code")}).code(ResponseCode.REQUEST_FAIL)
            }
        }
    } catch (error) {
        return reply.api({
            error: error
        }).code(ResponseCode.REQUEST_FAIL);
    }
}