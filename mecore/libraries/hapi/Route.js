const Filehound = require('filehound');
const Path = require('path');
const Fs = require('fs');
const _ = require('lodash');
const Utility = require('../Utility');

module.exports = {
  async Apply(instanceName, projectDir) {
    try {
      const hapi = global.meCore.projects[instanceName].hapi;
      if (Fs.existsSync(`${projectDir}/hapi/routes`)) {
        const pathRouteList = await Filehound.create()
        .path(`${projectDir}/hapi/routes`)
        .ext('.js')
        .glob('*Route.js')
        .find();
        _.forEach(pathRouteList, (pathRoute) => {
          const route = Utility.RequireWithCheckExist(pathRoute);
          hapi.server.route(route);
        });
      }
      if (Fs.existsSync(`${projectDir}/hapi/api`)) {
        const pathRouteList = await Filehound.create()
        .path(`${projectDir}/hapi/api`)
        .ext('.js')
        .glob('*Route.js')
        .find();
        _.forEach(pathRouteList, (pathRoute) => {
          const route = Utility.RequireWithCheckExist(pathRoute);
          hapi.server.route(route);
        });
      }
    } catch (error) {
      throw error;
    }
  }
};
