const ResponseCode = require("../../../../../../../config/ResponseCode");
const AccountModel = require("../../../../../../../models/AccountModel");

module.exports = async (request, reply) => {
    try {
        const {payload} = request;
        const account = await AccountModel.deleteOne({_id: payload._id})
        if (!account) {
            return reply.api({
                error: request.i18n.__("Cant Find")
            }).code(ResponseCode.REQUEST_FAIL);
        }
        else {
            return reply.api({
                success: success
            }).code(ResponseCode.REQUEST_SUCCESS);
        }
    } catch (error) {
        
    }
}