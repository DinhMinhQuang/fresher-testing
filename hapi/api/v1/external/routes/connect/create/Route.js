const Joi = require('mecore').Joi;
const ResponseCode = require('../../../../../../../constants/ResponseCode');
const Module = require('./Module');
module.exports = [
    {
        method: 'POST',
        path: '/v1/connect/create',
        handler: Module,
        options: {
            auth: false,
            tags: ['api', 'internal', 'v1'],
            validate: {
                payload: Joi.object({
                    userId: Joi.string().required().example('#da@1231E2e@2da@!!!#'),
                    appId: Joi.number().required().example(1),
                    phone: Joi.string().required().example('0931329271'),
                    fullname: Joi.string().required().example('Dinh Minh Quang')
                })
            },
            response: {
                status: {
                    [ResponseCode.REQUEST_SUCCESS]: Joi.object({
                        accountInfo: Joi.object().required()
                    }).label('SUCCESS'),
                    [ResponseCode.REQUEST_FAIL]: Joi.object({
                        error: Joi.string().required()
                    }).label('FAILED')
                }
            }
        }
    }
];
