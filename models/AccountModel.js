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
        phone: String,
        fullname: String,
        balance: Number,
        banks: [
            {
                type: Number,
                ref: "Bank"
            }
        ]
    }, {
        timestamps: true
    })
};

module.exports = Model;
