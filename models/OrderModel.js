const Schema = require('mecore').Mongoose.Schema;

const Model = {
    connection: 'default',
    tableName: 'Order',
    autoIncrement: {
        id: {
            startAt: 1,
            incrementBy: 1
        }
    },
    attributes: new Schema({
        user: {
            type: Number,
            ref: "User"
        },
        products: [
            {
                type: Number,
                ref: "Product"
            }
        ],
        amount: Number
    }, {
        timestamps: true
    })
};

module.exports = Model;
