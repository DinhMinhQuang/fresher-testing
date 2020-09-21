const _ = require('lodash');
const Utility = require('../../Utility');

module.exports = {
  async Apply(instanceName, projectDir) {
    try {
      const hapi = global.meCore.projects[instanceName].hapi;
      const config = Utility.RequireWithCheckExist(`${projectDir}/config/Hapi.js`);
      const options = _.get(config, 'plugins.apiResponseTime.options', {});
      await hapi.server.register({
        plugin: require('hapi-response-time'),
        options
      });

      return true;
    } catch (error) {
      throw error;
    }
  }
};
