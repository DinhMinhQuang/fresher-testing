const ResponseCode = require("../../../../../../../config/ResponseCode");
const AccountModel = require('../../../../../../../models/AccountModel');
module.exports = async (request, reply) => {
    const { payload } = request;
    try {
        let account = await AccountModel.findOne({ phone: payload.phone });
        if (!account) {
            return reply.api({
                error: request.i18n.__('Account not exist')
            });
        } else {
            account.walletApps = walletApps.slice().concat({
                appId: payload.appId,
                userId: payload.userId,
                balance: 0
            });
            account = await AccountModel.updateOne(account);
            return reply.api({
                userInfo: account
            }).code(ResponseCode.REQUEST_SUCCESS);
        }
    } catch (err) {
        return reply.api({
            message: err
        }).code(ResponseCode.REQUEST_FAIL);
    }
}