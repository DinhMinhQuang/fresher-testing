const Joi = require('mecore').Joi;
const AccountModel = require('../../../../../../../models/AccountModel');
const ResponseCode = require('../../../../../../../constants/ResponseCode');
const Module = require('./Module');

module.exports = [
    {
        method: "DELETE",
        path: "/v1/account/delete/{id}",
        handler: Module,
        options: {
            auth: 'Default',
            validate: {
                payload: Joi.object({
                    _id: Joi.string().example('5f6d661ce7dba92c50b67686').required()
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
]