const Filehound = require('filehound');
const Path = require('path');
const Fs = require('fs');
const _ = require('lodash');
const Utility = require('./Utility');

module.exports = {
  async Apply(instanceName, projectDir) {
    try {
      const log4js = global.meCore.projects[instanceName].log4js;
      const logger = log4js.getLogger('task');
      if (!Fs.existsSync(`${projectDir}/autoload`)) {
        Fs.mkdirSync(`${projectDir}/autoload`);
      }
      const pathAutoloadList = await Filehound.create()
        .path(`${projectDir}/autoload`)
        .ext('.js')
        .glob('*Autoload.js')
        .find();
      _.forEach(pathAutoloadList, (pathAutoload) => {
        const autoloadName = Path.basename(pathAutoload).replace('Autoload.js', '');
        const autoload = Utility.RequireWithCheckExist(pathAutoload);
        if (_.get(autoload, 'isActive', false) === false) {
          return true;
        }
        const onLoad = _.get(autoload, 'onLoad', () => {
          logger.warn(`${instanceName} - Not found function onLoad at Autoload ${autoloadName}`);
        });

        onLoad();
      });
      return true;
    } catch (error) {
      throw error;
    }
  }
};
