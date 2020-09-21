const _ = require('lodash');
const Utility = require('../../Utility');

module.exports = {
  async Apply(instanceName, projectDir) {
    try {
      const hapi = global.meCore.projects[instanceName].hapi;
      const config = Utility.RequireWithCheckExist(`${projectDir}/config/I18n.js`);
      await hapi.server.register({
        plugin: require('mecore-hapi-i18n-multi-instance'),
        options: config
      });

      return true;
    } catch (error) {
      throw error;
    }
  }
};
