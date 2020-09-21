const _ = require('lodash');
const Utility = require('../../Utility');
const Jwt = require('hapi-auth-jwt2');

module.exports = {
  async Apply(instanceName, projectDir) {
    let logger = null;
    try {
      const hapi = global.meCore.projects[instanceName].hapi;
      const config = Utility.RequireWithCheckExist(`${projectDir}/config/Hapi.js`);
      const jwtOptions = _.get(config, 'plugins.jwt.options', {});
      const log4js = global.meCore.projects[instanceName].log4js;
      logger = log4js.getLogger('system');
      await hapi.server.register([
        {
          plugin: Jwt,
          options: {
            payload: true
          }
        }
      ]);
      const error = [];
      _.forEach(jwtOptions.inject, (authName) => {
        const auth = Utility.RequireWithCheckExist(`${projectDir}/hapi/auth/${authName}Auth.js`);
        if (auth === false) {
          error.push(`[${authName}] - Find not found`);
        } else {
          hapi.server.auth.strategy(authName, 'jwt', auth);
        }
      });
      hapi.server.auth.default(jwtOptions.default);
      if (error.length > 0) {
        throw new Error(`[${instanceName}] - Jwt Auth error: \n${error.join('\n')}`);
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
};
