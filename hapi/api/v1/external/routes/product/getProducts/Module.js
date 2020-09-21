const ResponseCode = require("../../../../../../../config/ResponseCode");
const ProductModel = require("../../../../../../../models/ProductModel");

module.exports = async (request, reply) => {
    try {
        const product = await ProductModel.find();
        return reply.api(product).code(ResponseCode.REQUEST_SUCCESS);
    } catch (err) {
        return reply.api({
            message: err
        }).code(ResponseCode.REQUEST_FAIL);
    }
}