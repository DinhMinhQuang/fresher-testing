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
    username: String,
    password: String
  }, {
    timestamps: true
  })
};

module.exports = Model;
