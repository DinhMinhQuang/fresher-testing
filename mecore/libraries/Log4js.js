const _ = require('lodash');
const Utility = require('./Utility');
const Log4js = require('log4js');

global.meCore = global.meCore ? global.meCore : {};
global.meCore.temporaries = global.meCore.temporaries ? global.meCore.temporaries : {};
global.meCore.temporaries.log4js = global.meCore.temporaries.log4js ? global.meCore.temporaries.log4js : { appenders: { console: { type: 'console' } }, categories: { default: { appenders: ['console'], level: 'all' } } };
const configure = global.meCore.temporaries.log4js;

module.exports = {
  async Apply(instanceName, projectDir) {
    try {
      const log4jsConfig = Utility.RequireWithCheckExist(`${projectDir}/config/Log4js.js`);
      if (log4jsConfig === false) throw new Error('Log4js config not found');
      if (_.get(log4jsConfig, 'appenders', false) === false || _.get(log4jsConfig, 'categories', false) === false) throw new Error('Log4js config invalid');
      _.forEach(log4jsConfig.appenders, (v, k) => {
        configure.appenders[`[${instanceName}] ${k}`] = v;
      });
      _.forEach(log4jsConfig.categories, (v, k) => {
        _.forEach(v.appenders, (av, ak) => {
          v.appenders[ak] = `[${instanceName}] ${av}`;
        });
        configure.categories[`[${instanceName}] ${k}`] = v;
      });
      global.meCore.temporaries.log4js.pm2 = true;
      global.meCore.temporaries.log4js.pm2InstanceVar = `INSTANCE_${_.random(1111, 9999)}`;

      Log4js.configure(global.meCore.temporaries.log4js);

      const result = {
        getLogger: (category) => {
          if (_.get(configure.categories, `[${instanceName}] ${category}`, false) === false) {
            const logger = Log4js.getLogger(`[${instanceName}] default`);
            logger.warn(`[${instanceName}] - Log4js Error: Unhandled categories ${category}`);
            return logger;
          }
          return Log4js.getLogger(`[${instanceName}] ${category}`);
        }
      };
      global.meCore.projects[instanceName].log4js = result;

      return result;
    } catch (error) {
      throw error;
    }
  }
};
