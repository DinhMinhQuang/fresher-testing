const ResponseCode = require('../../../../../../../constants/ResponseCode');
const PartnerModel = require('../../../../../../../models/PartnerModel');
module.exports = async (request, reply) => {
    const payload = request.payload;
    try {
        const partner = await PartnerModel.create(payload);
        if (!partner) {
            return reply.api({
                message: request.i18n.__("Insert Failed")
            }).code(ResponseCode.REQUEST_FAIL);
        }
        return reply.api({
            message: "Insert Successfully"
        }).code(ResponseCode.REQUEST_SUCCESS);
    } catch (err) {
        return reply.api({
            message: err
        }).code(ResponseCode.REQUEST_FAIL);
    }
}