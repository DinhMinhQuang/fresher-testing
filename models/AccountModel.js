const Schema = require('mecore').Mongoose.Schema;

const Model = {
    connection: 'default',
    tableName: 'Account',
    autoIncrement: {
        id: {
            startAt: 1,
            incrementBy: 1
        }
    },
    attributes: new Schema({
        email: String,
        phone: String,
        username: String,
        balance: Number,
        password:String,
        verifyCode: {
            type: String,
            default: null
        },
        clientIp: [
            {
                type: String
            }
        ], 
        countWrongOTP: {
            type: Number, 
            default: 0
        },
        confirmed:{
            type: Boolean,
            default: false
        }
    }, {
        timestamps: true
    })
};

module.exports = Model;
