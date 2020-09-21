const ResponseCode = require("../../../../../../../config/ResponseCode");
const OrderModel = require("../../../../../../../models/OrderModel");
const ProductModel = require("../../../../../../../models/ProductModel");
const UserModel = require("../../../../../../../models/UserModel");
const queue = require('queue');
module.exports = async (request, reply) => {
    try {
        const { userId } = request.auth.credentials;
        const order = await OrderModel.findOne({ id: request.params.id });
        if (order) {
            order.products = await ProductModel.find({ id: { $in: order.products } });
            order.user = await UserModel.findOne({ id: order.user }).select("username id");
            return reply.api(order).code(ResponseCode.REQUEST_SUCCESS);
        }
        return reply.api(request.i18n.__("Can't find"));
    } catch (err) {
        return reply.api({
            message: err
        }).code(ResponseCode.REQUEST_FAIL);
    }
}