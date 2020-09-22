const Joi = require('mecore').Joi;
const AccountModel = require('../../../../../../../models/AccountModel');
const ResponseCode = require('../../../../../../../constants/ResponseCode');
const Module = require('./Module');
module.exports = [
    {
        method: 'POST',
        path: '/v1/account/create',
        handler: Module,
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    phone: Joi.string().regex(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/).example('0377740378'),
                    fullname: Joi.string().required().example('Pham Trong Nghia')
                }).label('PAYLOAD_TEST')
            },
            tags: ['api', 'internal', 'v1'],
            response: {
                status: {
                    [ResponseCode.REQUEST_SUCCESS]: Joi.object({
                        userInfo: Joi.object()
                    }).label('SUCCESS'),
                    [ResponseCode.REQUEST_FAIL]: Joi.object({
                        error: Joi.string()
                    }).label('FAILED')
                }
            }
        }
    }
];
