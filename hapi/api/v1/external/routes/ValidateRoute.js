const Joi = require('mecore').Joi;
const UserModel = require('../../../../../models/UserModel');
const ResponseCode = require('../../../../../config/ResponseCode');
const bcrypt = require('bcrypt');


module.exports = [
    {
        method: 'POST',
        path: '/v1/login',
        async handler(request, reply) {
            const payload = request.payload;
            const user = await UserModel.findOne({ username: payload.username });
            if (!user) {
                return reply.api(
                    request.i18n.__('Wrong username', {
                        clientIp: request.clientIp
                    })
                )
            }
            return new Promise((res, rej) => {
                bcrypt.compare(payload.password, user.password, (err, same) => {
                    if (!same) {
                        res(
                            reply.api(
                                request.i18n.__('Wrong password')
                            )
                        )
                    }
                    res(
                        reply.api(
                            {
                                "message": "successfully"
                            }
                        )
                    )
                })
            })

        },
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    username: Joi.string().min(6).max(20).example('benalpha1105'),
                    password: Joi.string().min(5).max(20).example('123456')
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
    },
    {
        method: 'POST',
        path: '/v1/register',
        async handler(request, reply) {
            const payload = request.payload;
            const user = await UserModel.findOne({ username: payload.username });
            if (!user) {
                bcrypt.hash(payload.password, 10, (err, hashedPass) => {
                    payload.password = hashedPass;
                    UserModel.create(payload);
                })
            }
            return reply.api({
                test: request.i18n.__('Client IP {{clientIp}}', {
                    clientIp: request.clientIp
                })
            }).code(1000);
        },
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    username: Joi.string().min(6).max(20).example('benalpha1105'),
                    password: Joi.string().min(5).max(20).example('123456')
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
        path: '/v2/login',
        handler(request, reply) {
            const payload = request.payload;
            return reply.api({
                ip: request.i18n.__('Client IP {{clientIp}}', {
                    clientIp: request.clientIp
                })
            }).code(1000);
        },
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
