const AccountModel = require('../../../../../../../models/AccountModel');
const ReponseCode = require('../../../../../../../constants/ResponseCode');
module.exports = async (request, reply) => {
    const { payload } = request;
    try {
        let account = await AccountModel.findOne({ phone: payload.phone });
        if (!account) {
            account = await AccountModel.create(payload);
            return reply.api({
                userInfo: account
            }).code(ReponseCode.REQUEST_SUCCESS);
        }
        return reply.api({
            error: request.i18n.__("Phone exists")
        }).code(ReponseCode.REQUEST_FAIL);
    } catch (err) {
        return reply.api({
            error: err
        }).code(ReponseCode.REQUEST_FAIL);
    }
}