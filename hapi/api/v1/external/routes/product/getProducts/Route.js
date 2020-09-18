const Joi = require('mecore').Joi;
const ProductModel = require('../../../../../../../models/ProductModel');
const ResponseCode = require('../../../../../../../config/ResponseCode');
module.exports = [
     
    {
        method: 'GET',
        path: '/v1/product',
        handler: async (request, reply) => {
            try {
                const product = await ProductModel.find();
                return reply.api(product).code(ResponseCode.REQUEST_SUCCESS)
            } catch (err) {
                return reply.api({
                    message: err
                }).code(ResponseCode.REQUEST_FAIL);
            }
        },
        options: {
            auth: "Default",
            tags: ['api', 'internal', 'v1'],
            response: {
                status: {
                    [ResponseCode.REQUEST_SUCCESS]: Joi.array().items(Joi.object()).label('TEST_SUCCESS')
                }
            }
        }
    }
];
