const Schema = require('mecore').Mongoose.Schema;
const Joi = require('mecore').Joi;

const Model = {
  connection: 'default',
  tableName: 'Product',
  autoIncrement: {
    id: {
      startAt: 1,
      incrementBy: 1
    }
  },
  attributes: new Schema({
    name: String,
    price: Number
  }, {
    timestamps: true
  })
};

module.exports = Model;
