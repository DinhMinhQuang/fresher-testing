const Joi = require('mecore').Joi;
const ProductModel = require('../../../../../models/ProductModel');
const ResponseCode = require('../../../../../config/ResponseCode');
module.exports = [
    
    {
        method: 'POST',
        path: '/v1/product',
        handler: async (request, reply) => {
            const payload = request.payload;
            try {
                const product = await ProductModel.create(payload);
                if (!product) {
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
        },
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    name: Joi.string().min(3).example("Revive"),
                    price: Joi.number().min(1000).example(1000)
                }).label('PAYLOAD_TEST')
            },
            tags: ['api', 'internal', 'v1'],
            response: {
                status: {
                    [ResponseCode.REQUEST_SUCCESS]: Joi.object({
                        message: Joi.string()
                    }).label('TEST_SUCCESS')
                }
            }
        }
    }
];
