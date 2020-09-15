const I18n = require('i18n-support-multi-instance');
const Utility = require('./Utility');

module.exports = {
  async Apply(instanceName, projectDir) {
    try {
      const i18n = new I18n();
      const config = Utility.RequireWithCheckExist(`${projectDir}/config/I18n.js`);
      config.directory = `${projectDir}/locales`;
      config.autoReload = true;
      i18n.configure(config);
      global.meCore.projects[instanceName].i18n = global.meCore.projects[instanceName].i18n ? global.meCore.projects[instanceName].i18n : i18n;
      return true;
    } catch (error) {
      throw error;
    }
  }
};
