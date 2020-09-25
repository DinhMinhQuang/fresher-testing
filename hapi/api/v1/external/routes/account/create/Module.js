const AccountModel = require('../../../../../../../models/AccountModel');
const ResponseCode = require('../../../../../../../constants/ResponseCode');
module.exports = async (request, reply) => {
    const { payload } = request;
    try {
        let account = await AccountModel.findOne({ phone: payload.phone });
        if (!account) {
            account = await AccountModel.create(payload);
            return reply.api({
                userInfo: account
            }).code(ResponseCode.REQUEST_SUCCESS);
        }
        return reply.api({
            error: request.i18n.__("Phone exists")
        }).code(ResponseCode.REQUEST_FAIL);
    } catch (err) {
        return reply.api({
            error: err
        }).code(ResponseCode.REQUEST_FAIL);
    }
}