const ResponseCode = require('../../../../../../../../constants/ResponseCode');
module.exports = async (request, reply) => {
    try {
        return reply.api(request.i18n.__("Can't find"));
    } catch (err) {
        return reply.api({
            message: err
        }).code(ResponseCode.REQUEST_FAIL);
    }
}
