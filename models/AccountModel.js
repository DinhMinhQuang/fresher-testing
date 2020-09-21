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
        fullname: String,
        partner: [
            {
                type:Number
            }
        ]
    }, {
        timestamps: true
    })
};

module.exports = Model;
