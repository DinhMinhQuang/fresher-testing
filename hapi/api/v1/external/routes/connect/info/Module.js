const ResponseCode = require("../../../../../../../config/ResponseCode");
const UserModel = require('../../../../../../../models/UserModel');


module.exports = async (request, reply) => {
    const { payload } = request;
    try {
        const user = await UserModel.findOne({
            ...payload
        });
        console.log(user);
        if (user) {
            return reply.api({
                message: "Successfully"
            })
        } else {
            return reply.api({
                message: "Failed"
            })
        }
    } catch (err) {
        return reply.api({
            message: err
        }).code(ResponseCode.REQUEST_FAIL);
    }
}