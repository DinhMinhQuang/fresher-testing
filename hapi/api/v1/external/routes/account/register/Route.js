const Joi = require('mecore').Joi;
const AccountModel = require('../../../../../../../models/AccountModel');
const ResponseCode = require('../../../../../../../constants/ResponseCode');
const Module = require('./Module');


module.exports = [
    {
        method: "POST",
        path: "/v1/account/register",
        handler: Module,
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    phone: Joi.string().regex(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/).example('0931329271').required(),
                    username: Joi.string().required().regex(/^[^0-9][a-zA-Z0-9]{8,}$/).example('minhquang123'),
                    email: Joi.string().regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).example('minhquang@gmail.com').required(),
                    password: Joi.string().example('minhquang2411').required()
                }).label('REGISTER')
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