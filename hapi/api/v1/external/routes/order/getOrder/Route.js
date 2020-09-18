const Joi = require('mecore').Joi;
const OrderModel = require('../../../../../../../models/OrderModel');
const ResponseCode = require('../../../../../../../config/ResponseCode');
module.exports = [
    {
        method: 'GET',
        path: '/v1/order/{id}',
        handler: async (request, reply) => {
            try {
                const { userId } = request.auth.credentials;
                const order = await OrderModel.findOne({ id: request.params.id });
                if (order) {
                    return reply.api(order).code(ResponseCode.REQUEST_SUCCESS);
                }
                return reply.api(request.i18n.__("Can't find"));
            } catch (err) {
                return reply.api({
                    message: err
                }).code(ResponseCode.REQUEST_FAIL);
            }
        },
        options: {
            auth: 'Default',
            tags: ['api', 'internal', 'v1'],
            validate: {
                params: Joi.object(
                    {
                        id: Joi.number().example(1)
                    }
                )
            },
            response: {
                status: {
                    [ResponseCode.REQUEST_SUCCESS]: Joi.object(OrderModel.attributes).label('ORDER')
                }
            }
        }
    }
];
