const Joi = require('mecore').Joi;
const OrderModel = require('../../../../../../../models/OrderModel');
const ResponseCode = require('../../../../../../../config/ResponseCode');
const Module = require('./Module');
module.exports = [
    {
        method: 'GET',
        path: '/v1/order/{id}',
        handler: Module,
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
