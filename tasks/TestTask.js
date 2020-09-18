// # expression
// # ┌────────────── second (optional)
// # │ ┌──────────── minute
// # │ │ ┌────────── hour
// # │ │ │ ┌──────── day of month
// # │ │ │ │ ┌────── month
// # │ │ │ │ │ ┌──── day of week
// # │ │ │ │ │ │
// # │ │ │ │ │ │
// # * * * * * *

module.exports = {
  isActive: false,
  expression: '* * * * * *',
  options: {
    timeZone: 'Asia/Ho_Chi_Minh',
    runOnInit: false
  },
  onTick: () => {
    const app = require('..').getInstance();
    const logger = app.log4js.getLogger('default');
    logger.info('Test Task');
  }
};
