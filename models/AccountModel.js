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
        verifyCode: String, 
        banks: [
            {
                type: Number,
                ref: "Bank"
            }
        ],
        confirmed:{
            type: Boolean,
            default: false
        }
    }, {
        timestamps: true
    })
};

module.exports = Model;
