const AccountModel = require('../../../../../../../models/AccountModel');
const ResponseCode = require('../../../../../../../constants/ResponseCode');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const redis = require("redis");
const client = redis.createClient();
const {promisify} = require('util')

module.exports = async (request, reply) => {
    const {payload} = request;
    const username = await promisify(client.get).call(client, payload.username);
    const clientIp = await promisify(client.get).call(client,"clientIp");
    const userWrong = await promisify(client.get).call(client,"userWrong");
    const spamTime = await promisify(client.get).call(client, "spamTime")
    const ipWrong = await promisify(client.get).call(client, "ipWrong")
    try {
        let account = await AccountModel.findOne({username: payload.username })
        if (account) {
            if (request.clientIp !== clientIp) {
                if (payload.username !== username){
                    if (account.confirmed == true) {
                        if (bcrypt.compareSync(payload.password, account.password)) {
                            let token = jwt.sign({id: account.id, phone: account.phone}, '123456', { algorithm: "HS256" })
                            return reply.api({
                                access_token: token
                            }).code(ResponseCode.REQUEST_SUCCESS);
                        }
                        else {
                            client.incrby("userWrong", 1)
                            client.setex("spamTime", 120, 'Check Spam')
                            if (spamTime != null) {
                                client.incrby("ipWrong", 1)
                                if (ipWrong > 20) {
                                    client.decr("ipWrong", 21)
                                    client.setex("clientIp", 3600, request.clientIp)
                                }
                            }
                            else { 
                                client.decr("ipWrong", 21)
                            }
                            if (userWrong < 3) { 
                                console.log(userWrong)
                                return reply.api({error: request.i18n.__("Wrong Password")}).code(ResponseCode.REQUEST_FAIL)
                            }
                            else {
                                client.decrby("userWrong", 4)
                                client.setex(account.username, 60, account.username)
                                return reply.api({error: request.i18n.__("Your username Has Been Block For 5 min")}).code(ResponseCode.REQUEST_FAIL)
                            }                       
                        }
                    }
                    else { 
                        return reply.api({error: request.i18n.__("Verify Email")}).code(ResponseCode.REQUEST_FAIL)
                    }
                }
                else {
                    return reply.api({error: request.i18n.__("Waiting For 5 min Dudeeee")}).code(ResponseCode.REQUEST_FAIL)
                }
            }
            else { 
                return reply.api({error: request.i18n.__("Your Ip Has Been Block For 60 min")}).code(ResponseCode.REQUEST_FAIL)
            }
        }
        else { 
            return reply.api({error: request.i18n.__("Wrong Email")}).code(ResponseCode.REQUEST_FAIL)
        }
    } catch (error) {
        return reply.api({
            error: error
        }).code(ResponseCode.REQUEST_FAIL);
    }
}