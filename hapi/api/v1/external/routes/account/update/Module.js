const ResponseCode = require("../../../../../../../config/ResponseCode");
const AccountModel = require("../../../../../../../models/AccountModel");

module.exports = async (request, reply) => {
    try {
        const { payload } = request
        let account = await AccountModel.findByIdAndUpdate(payload._id, payload, {new: true});
        if (!account) {
            return reply.api({
                error: request.i18n.__("Cant Find")
            }).code(ResponseCode.REQUEST_FAIL);
        }
        else {
            return reply.api({
                userInfo: account
            }).code(ResponseCode.REQUEST_SUCCESS);
        }
    } catch (error) {
        return reply.api({
            message: error
        }).code(ResponseCode.REQUEST_FAIL)
    }
}