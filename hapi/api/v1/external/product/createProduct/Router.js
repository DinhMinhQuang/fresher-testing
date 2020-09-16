const Joi = require('mecore').Joi;
const ProductModel = require('../../../../../../models/ProductModel');
const ResponseCode = require('../../../../../config/ResponseCode');
const Module = require('./Module');
module.exports = [
    {
        method: 'POST',
        path: '/v1/product',
        handler: Module,
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    username: Joi.string().min(1).max(20).example('11').description('test')
                }).label('PAYLOAD_TEST')
            },
            tags: ['api', 'internal', 'v1'],
            response: {
                status: {
                    [ResponseCode.REQUEST_SUCCESS]: Joi.object({
                        test: Joi.string()
                    }).label('TEST_SUCCESS')
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/v2/product',
        handler: Module,
        options: {
            // auth: 'Local',
            validate: {
                payload: Joi.object({
                    username: Joi.string().min(1).max(20).example('11').description('test')
                }).label('PAYLOAD_TEST')
            },
            tags: ['api', 'external-v2'],
            response: {
                status: {
                    [ResponseCode.REQUEST_SUCCESS]: Joi.object({
                        ip: Joi.string()
                    }).label('TEST_SUCCESS')
                }
            }
        }
    }
];
