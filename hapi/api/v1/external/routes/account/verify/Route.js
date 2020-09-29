const Joi = require('mecore').Joi;
const AccountModel = require('../../../../../../../models/AccountModel');
const ResponseCode = require('../../../../../../../constants/ResponseCode');
const Module = require('./Module');


module.exports = [
    {
        method: "POST",
        path: "/v1/account/verify",
        handler: Module,
        options: {
            auth: 'Default',
            validate: {
                payload: Joi.object({
                    verifyCode: Joi.string().example('nBtRD6PBlc').required()
                }).label('VERIFY')
            },
            tags: ['api', 'internal', 'v1'],
            response: {
                status: {
                    [ResponseCode.REQUEST_SUCCESS]: Joi.object({
                        success: Joi.string()
                    }).label('SUCCESS'),
                    [ResponseCode.REQUEST_FAIL]: Joi.object({
                        error: Joi.string()
                    }).label('FAILED')
                }
            }
        } 
    }
]