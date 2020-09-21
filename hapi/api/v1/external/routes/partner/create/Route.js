const Joi = require('mecore').Joi;
const ResponseCode = require('../../../../../../../constants/ResponseCode');
const Module = require('./Module');
module.exports = [

    {
        method: 'POST',
        path: '/v1/partner',
        handler: Module,
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    name: Joi.string().required().example("Tiki")
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
