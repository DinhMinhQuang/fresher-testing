const Joi = require('mecore').Joi;
const ProductModel = require('../../../../../../../models/ProductModel');
const ResponseCode = require('../../../../../../../config/ResponseCode');
const Module = require('./Module');
module.exports = [

    {
        method: 'GET',
        path: '/v1/product',
        handler: Module,
        options: {
            auth: "Default",
            tags: ['api', 'internal', 'v1'],
            response: {
                status: {
                    [ResponseCode.REQUEST_SUCCESS]: Joi.array().items(Joi.object()).label('TEST_SUCCESS')
                }
            }
        }
    }
];
