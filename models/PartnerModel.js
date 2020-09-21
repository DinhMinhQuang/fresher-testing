const Schema = require('mecore').Mongoose.Schema;

const Model = {
    connection: 'default',
    tableName: 'Partner',
    autoIncrement: {
        id: {
            startAt: 1,
            incrementBy: 1
        }
    },
    attributes: new Schema({
        name:String
    }, {
        timestamps: true
    })
};

module.exports = Model;
