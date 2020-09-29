const AccountModel = require('../../../../../../../models/AccountModel');
const ResponseCode = require('../../../../../../../constants/ResponseCode');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const redis = require("redis");
const client = redis.createClient();

module.exports = async (request, reply) => {
    const {payload} = request;
    try {
        let account = await AccountModel.findOne({username: payload.username })
        if (account) {
            if (account.confirmed == true) {
                if (bcrypt.compareSync(payload.password, account.password)) {
                    let token = jwt.sign({id: account.id, phone: account.phone}, '123456', { algorithm: "HS256" })
                    client.setex("username", 60, "minhquang");
                    return reply.api({
                        access_token: token
                    }).code(ResponseCode.REQUEST_SUCCESS);
                }
                else {
                    
                    return reply.api({error: request.i18n.__("Wrong Password")}).code(ResponseCode.REQUEST_FAIL)
                }
            }
            else { 
                return reply.api({error: request.i18n.__("Verify Email")}).code(ResponseCode.REQUEST_FAIL)
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