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
                params: Joi.object({
                    id: Joi.number().example(1)
                })
            },
            tags: ['api', 'internal', 'v1'],
            response: {
                status: {
                    [ResponseCode.REQUEST_SUCCESS]: Joi.object({
                        success: Joi.object()
                    }).label('SUCCESS'),
                    [ResponseCode.REQUEST_FAIL]: Joi.object({
                        error: Joi.string()
                    }).label('FAILED')
                }
            }
        }
    }
]