const Schema = require('mecore').Mongoose.Schema;
const Joi = require('mecore').Joi;

const Model = {
  connection: 'default',
  tableName: 'User',
  autoIncrement: {
    id: {
      startAt: 1,
      incrementBy: 1
    }
  },
  attributes: new Schema({
    fullname: String,
    userId: String,
    accountId: String,
    appId: String,
    balance: Number
  }, {
    timestamps: true
  })
};

module.exports = Model;
