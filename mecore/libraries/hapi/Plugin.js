const Filehound = require('filehound');
const Path = require('path');
const Fs = require('fs');
const _ = require('lodash');
const Utility = require('../Utility');

module.exports = {
  async Apply(instanceName, projectDir) {
    try {
      const hapi = global.meCore.projects[instanceName].hapi;
      const config = Utility.RequireWithCheckExist(`${projectDir}/config/Hapi.js`);

      const isActiveApiSecurity = _.get(config, 'plugins.apiSecurity.isActive', false);
      if (isActiveApiSecurity === true) {
        const ApiSecurity = require('./plugins/ApiSecurity');
        await ApiSecurity.ApplyRequest(instanceName, projectDir);
      }
      const isActiveSwagger = _.get(config, 'plugins.swagger.isActive', false);
      if (isActiveSwagger === true) {
        const Swagger = require('./plugins/Swagger');
        await Swagger.Apply(instanceName, projectDir);
      }
      const isActiveApiReply = _.get(config, 'plugins.apiReply.isActive', false);
      if (isActiveApiReply === true) {
        const ApiReply = require('./plugins/ApiReply');
        await ApiReply.Apply(instanceName, projectDir);
      }
      const isActiveJwt = _.get(config, 'plugins.jwt.isActive', false);
      if (isActiveJwt === true) {
        const Jwt = require('./plugins/Jwt');
        await Jwt.Apply(instanceName, projectDir);
      }
      const isActiveApiVersion = _.get(config, 'plugins.apiVersion.isActive', false);
      if (isActiveApiVersion === true) {
        const ApiVersion = require('./plugins/ApiVersion');
        await ApiVersion.Apply(instanceName, projectDir);
      }
      const isActiveApiResponseTime = _.get(config, 'plugins.apiResponseTime.isActive', false);
      if (isActiveApiResponseTime === true) {
        const ApiResponseTime = require('./plugins/ApiResponseTime');
        await ApiResponseTime.Apply(instanceName, projectDir);
      }
      const isActiveI18n = _.get(config, 'plugins.i18n.isActive', false);
      if (isActiveI18n === true) {
        const I18n = require('./plugins/I18n');
        await I18n.Apply(instanceName, projectDir);
      }
      const isActiveClientIp = _.get(config, 'plugins.clientIp.isActive', false);
      if (isActiveClientIp === true) {
        const ClientIp = require('./plugins/ClientIp');
        await ClientIp.Apply(instanceName, projectDir);
      }
      if (isActiveApiSecurity === true) {
        const ApiSecurity = require('./plugins/ApiSecurity');
        await ApiSecurity.ApplyReply(instanceName, projectDir);
      }
    } catch (error) {
      throw error;
    }
  }
};
