const Joi = require('mecore').Joi;
const AccountModel = require('../../../../../../../models/AccountModel');
const ResponseCode = require('../../../../../../../constants/ResponseCode');
const Module = require('./Module');

module.exports = [
    {
        method: "POST",
        path: "/v1/account/forgot",
        handler: Module,
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    username: Joi.string().required().regex(/^[^0-9][a-zA-Z0-9]{8,}$/).example('minhquang123'),
                }).label('VERIFY')
            },
            tags: ['api', 'internal', 'v1'],
            response: {
                status: {
                    [ResponseCode.REQUEST_SUCCESS]: Joi.object({
                        message: Joi.string()
                    }).label('TOKEN').unknown(true),
                    [ResponseCode.REQUEST_SUCCESS]: Joi.object({
                        access_token: Joi.string()
                    }).label('TOKEN').unknown(true),
                    [ResponseCode.REQUEST_FAIL]: Joi.object({
                        error: Joi.string()
                    }).label('FAILED')
                }
            }
        } 
    }
]