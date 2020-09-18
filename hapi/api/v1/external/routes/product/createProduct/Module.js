const ProductModel = require('../../../../../../models/ProductModel');
module.exports = (request, reply) => {
    const payload = request.payload;
    try {
        ProductModel.insert(payload, (err, doc) => {
            if (err) {
                return reply.api({
                    message: err
                }).code(1001);
            }
            return reply.api({
                message: doc
            }).code(1000);
        })
    } catch (err) {
        return reply.api({
            message: err
        }).code(1001);
    }
}