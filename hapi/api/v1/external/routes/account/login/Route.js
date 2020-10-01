const Joi = require('mecore').Joi
const ResponseCode = require('../../../../../../../constants/ResponseCode')
const Module = require('./Module')

module.exports = [
    {
        method: 'POST',
        path: '/v1/account/login',
        handler: Module,
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    username: Joi.string().example('minhquang2411').regex(/^[^0-9][a-zA-Z0-9]{8,}$/).required(),
                    password: Joi.string().example('minhquang2411').required()
                }).label('LOGIN')
            },
            tags: ['api', 'internal', 'v1'],
            response: {
                status: {
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