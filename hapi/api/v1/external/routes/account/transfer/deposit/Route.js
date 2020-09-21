const Joi = require('mecore').Joi;
const ResponseCode = require('../../../../../../../../constants/ResponseCode');
const Module = require('./Module');
module.exports = [
    {
        method: 'POST',
        path: '/v1/Partner/Recharge',
        handler: Module,
        options: {
            auth: 'Default',
            tags: ['api', 'internal', 'v1'],
            validate: {
                payload: Joi.object(
                    {
                        amount: Joi.number().min(50000).max(5000000),
                        partnerId: Joi.number().required(),
                        phone: Joi.string().required(),
                        userId: Joi.number().required()
                    }
                )
            },
            response: {
                status: {
                    [ResponseCode.REQUEST_SUCCESS]: Joi.object({}).label('ORDER')
                }
            }
        }
    }
];
