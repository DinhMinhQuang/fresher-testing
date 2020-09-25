const ResponseCode = require("../../../../../../../config/ResponseCode");
const AccountModel = require("../../../../../../../models/AccountModel");

module.exports = async (request, reply) => {
    try {
        const user = await AccountModel.find();
        return reply.api(user).code(ResponseCode.REQUEST_SUCCESS);
    } catch (error) {
        return reply.api({
            message: error
        }).code(ResponseCode.REQUEST_FAIL)
    }
}