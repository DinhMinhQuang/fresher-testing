const _ = require('lodash');
const Utility = require('../../Utility');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
module.exports = {
  async Apply(instanceName, projectDir) {
    try {
      const hapi = global.meCore.projects[instanceName].hapi;
      const config = Utility.RequireWithCheckExist(`${projectDir}/config/Hapi.js`);
      const swaggerOptions = _.get(config, 'plugins.swagger.options', {});
      await hapi.server.register([
        Inert,
        Vision,
        {
          plugin: HapiSwagger,
          options: swaggerOptions
        }
      ]);
      return true;
    } catch (error) {
      throw error;
    }
  }
};
