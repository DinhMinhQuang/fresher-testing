const _ = require('lodash');
const Utility = require('../../Utility');
const CryptoJS = require('crypto-js');
const ShortId = require('shortid');
const Md5 = require('md5');
const Boom = require('boom');
const NodeRSA = require('node-rsa');

const Private = {
  RequestDecrypt: (request, options) => {
    try {
      const payload = request.payload;
      const xAPIKey = request.headers['x-api-key'];
      const xAPIClient = request.headers['x-api-client'];
      const xAPIValidate = request.headers['x-api-validate'];
      const xAPIAction = request.headers['x-api-action'];
      const xAPIMessage = _.get(payload, 'x-api-message', '');
      const accessToken = _.get(request.headers, 'authorization', '');
      let encryptKey = request.encryptKey;
      if (_.isUndefined(encryptKey)) {
        const rsaKey = _.get(options, `client.${xAPIClient}`, null);
        if (_.isNull(rsaKey)) {
          throw Boom.unauthorized('"x-api-client" not found!');
        }
     
        try {
          const key = new NodeRSA(rsaKey.privateKey);
          encryptKey = key.decrypt(xAPIKey, 'utf8');
        } catch (error) {
          throw Boom.unauthorized('"x-api-key" invalid');
        }
      }
      const objValidate = {
        'x-api-action': xAPIAction,
        method: _.toUpper(request.method),
        accessToken,
        'x-api-message': xAPIMessage
      };
      const validate = Md5(_.values(objValidate).join('') + encryptKey);
      if (validate !== xAPIValidate) {
        throw Boom.unauthorized(request.__('"x-api-validate" invalid'));
      }
      let result = null;
      try {
        if (xAPIMessage !== '') {
          result = JSON.parse(CryptoJS.AES.decrypt(xAPIMessage, encryptKey).toString(CryptoJS.enc.Utf8));
        }
      } catch (error) {
        throw Boom.unauthorized(request.__('"x-api-message" invalid'));
      } 
      return result;
    } catch (error) {
      throw error;
    }
  },
  ApiSecurityRequest: {
    name: 'ApiSecurityRequest',
    version: '1.0.0',
    async register(server, options) {
      server.ext('onRequest', (request, reply) => {
        const xAPIKey = request.headers['x-api-key'];
        const xAPIClient = request.headers['x-api-client'];
        const xAPIAction = request.headers['x-api-action'];
        const rsaKey = _.get(options, `client.${xAPIClient}`, null);
        if (xAPIKey) {
          if (_.isNull(rsaKey)) {
            throw Boom.unauthorized('"x-api-client" not found!');
          }
          let encryptKey;
          try {
            const key = new NodeRSA(rsaKey.privateKey);
            encryptKey = key.decrypt(xAPIKey, 'utf8');
            if (!encryptKey) {
              throw Boom.unauthorized('"x-api-key" invalid');
            }
          } catch (error) {
            throw Boom.unauthorized('"x-api-key" invalid');
          }
          let result = null;
          try {
            result = CryptoJS.AES.decrypt(xAPIAction, encryptKey).toString(CryptoJS.enc.Utf8);
          } catch (error) {
            throw Boom.unauthorized('"x-api-action" invalid');
          } 
          request.encryptKey = encryptKey;
          request.setUrl(result);
        }
        return reply.continue;
      });
      server.ext('onPostAuth', (request, reply) => {
        try {
          if (_.get(request, 'route.settings.plugins.apiSecurity', true) === true) {
            request.payload = Private.RequestDecrypt(request, options);
          }
        } catch (error) {
          throw Boom.unauthorized(request.__(error.message));
        }
        return reply.continue;
      });
    }
  },
  ApiSecurityReply: {
    name: 'ApiSecurityReply',
    version: '1.0.0',
    async register(server, options) {
      server.ext('onPreResponse', (request, reply) => {
        if (_.get(request, 'route.settings.plugins.apiSecurity', true) === true) {
          const response = request.response;
          const xAPIClient = request.headers['x-api-client'];
          const xAPIAction = request.headers['x-api-action'];
          const rsaKey = _.get(options, `client.${xAPIClient}`, null);
          if (_.isNull(rsaKey) === false) {
            const encryptKey = ShortId.generate();
            const key = new NodeRSA(rsaKey.publicKey);
            const xAPIKey = key.encrypt(encryptKey, 'base64');
            const xApiMessage = CryptoJS.AES.encrypt(JSON.stringify(response.source), encryptKey).toString();
            const accessToken = _.get(request.headers, 'authorization', '');
            const objValidate = {
              'x-api-action': xAPIAction,
              method: _.toUpper(request.method),
              accessToken,
              'x-api-message': xApiMessage
            };
            const xAPIValidate = Md5(_.values(objValidate).join('') + encryptKey);
            return reply.response({
              'x-api-message': xApiMessage
            }).header('x-api-key', xAPIKey)
          .header('x-api-client', xAPIClient)
          .header('x-api-action', xAPIAction)
          .header('x-api-validate', xAPIValidate)
          .code(200);
          }
        }
        return reply.continue;
      });
    }
  }
};

module.exports = {
  async ApplyRequest(instanceName, projectDir) {
    try {
      const hapi = global.meCore.projects[instanceName].hapi;
      const config = Utility.RequireWithCheckExist(`${projectDir}/config/Hapi.js`);
      await hapi.server.register({
        plugin: Private.ApiSecurityRequest,
        options: _.get(config, 'plugins.apiSecurity.options', {})
      });
      hapi.server.method('ApiSecurityRequestDecrypt', Private.RequestDecrypt, {});
      return true;
    } catch (error) {
      throw error;
    }
  },
  async ApplyReply(instanceName, projectDir) {
    try {
      const hapi = global.meCore.projects[instanceName].hapi;
      const config = Utility.RequireWithCheckExist(`${projectDir}/config/Hapi.js`);
      await hapi.server.register({
        plugin: Private.ApiSecurityReply,
        options: _.get(config, 'plugins.apiSecurity.options', {})
      });
      return true;
    } catch (error) {
      throw error;
    }
  }
};
