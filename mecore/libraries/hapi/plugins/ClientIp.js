const _ = require('lodash');
const Utility = require('../../Utility');
const RequestIp = require('request-ip');

const Private = {
  ClientIp: {
    name: 'clientIp',
    version: '1.0.0',
    async register(server, options) {
      server.ext('onRequest', (request, reply) => {
        request.clientIp = RequestIp.getClientIp(request);
        return reply.continue;
      });
    }
  }
};

module.exports = {
  async Apply(instanceName, projectDir) {
    try {
      const hapi = global.meCore.projects[instanceName].hapi;
      const config = Utility.RequireWithCheckExist(`${projectDir}/config/Hapi.js`);
      await hapi.server.register({
        plugin: Private.ClientIp,
        options: _.get(config, 'plugins.clientIp.options', {})
      });
      return true;
    } catch (error) {
      throw error;
    }
  }
};
