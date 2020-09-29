const ResponseCode = require("../../../../../../../config/ResponseCode");
const AccountModel = require("../../../../../../../models/AccountModel");

module.exports = async (request, reply) => {
    try {
        const {userId} = request.params.id;
        const account = await AccountModel.deleteOne({id: userId})
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
        return reply.api({
            error: error
        }).code(ResponseCode.REQUEST_FAIL);
    }
}