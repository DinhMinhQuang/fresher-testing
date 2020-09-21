const Filehound = require('filehound');
const _ = require('lodash');
const Utility = require('./Utility');
const Hapi = require('@hapi/hapi');
const Route = require('./hapi/Route');
const Plugin = require('./hapi/Plugin');

module.exports = {
  async Apply(instanceName, projectDir) {
    let logger = null;
    try {
      global.meCore.projects[instanceName].hapi = global.meCore.projects[instanceName].hapi ? global.meCore.projects[instanceName].hapi : {
        server: null
      };
      const hapi = global.meCore.projects[instanceName].hapi;
      const log4js = global.meCore.projects[instanceName].log4js;
      logger = log4js.getLogger('system');
      const config = Utility.RequireWithCheckExist(`${projectDir}/config/Hapi.js`);
      const isActiveHapi = _.get(config, 'isActive', false);
      if (isActiveHapi === false) {
        return false;
      } 
      hapi.server = Hapi.server(config.server);
      await Plugin.Apply(instanceName, projectDir);
      await Route.Apply(instanceName, projectDir);
      logger.info(`[${instanceName}] - Hapi Server running on ${hapi.server.info.uri}`);
      await hapi.server.start();
    } catch (error) {
      throw error;
    }
  }
};
