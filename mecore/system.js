const _ = require('lodash');
const Path = require('path');

const Config = require('./libraries/Config');
const Log4js = require('./libraries/Log4js');
const I18n = require('./libraries/I18n');
const Mongoose = require('./libraries/Mongoose');
const Autoload = require('./libraries/Autoload');
const Task = require('./libraries/Task');
const Hapi = require('./libraries/Hapi');
const Utility = require('./libraries/Utility');

global.meCore = global.meCore ? global.meCore : {};
global.meCore.projects = global.meCore.projects ? global.meCore.projects : {};

const project = global.meCore.projects;

const Private = {
  FilterInstance(instance) {
    return {
      isReady: instance.isReady,
      log4js: {
        getLogger: instance.log4js.getLogger
      },
      i18n: instance.i18n,
      models: _.get(instance, 'mongoose.models', {}),
      hapi: _.get(instance, 'hapi', {})
    };
  }
};

class System {
  constructor(instanceName, projectDir) {
    this.instanceName = _.toUpper(instanceName);
    this.projectDir = Path.resolve(projectDir);
    global.meCore.projects[this.instanceName] = global.meCore.projects[instanceName] ? global.meCore.projects[instanceName] : {
      isReady: false
    };
  }

  async Start(callback) {
    let log4js;
    let logger = null;
    try {
      await Config.Apply(this.projectDir);
      log4js = await Log4js.Apply(this.instanceName, this.projectDir);
      logger = log4js.getLogger('system');
      await I18n.Apply(this.instanceName, this.projectDir);
      await Mongoose.Apply(this.instanceName, this.projectDir);
      await Hapi.Apply(this.instanceName, this.projectDir, logger);
      await Autoload.Apply(this.instanceName, this.projectDir);
      await Task.Apply(this.instanceName, this.projectDir);
      if (_.isFunction(callback)) {
        callback();
      }
      project[this.instanceName].isReady = true;
      const result = Private.FilterInstance(project[this.instanceName]);
      return result;
    } catch (error) {
      if (_.isUndefined(logger.error)) {
        logger.error(error.message, '\n\n', error.stack);
      } else {
        console.log(error.message, '\n\n', error.stack);
      }

      process.exit(1);
      throw error;
    }
  }
}

module.exports = System;

module.exports.getInstance = (instanceName) => {
  instanceName = _.toUpper(instanceName);
  if (_.get(global, `meCore.projects['${instanceName}']`, false) === false) {
    throw new Error('Instance not found');
  }
  return Private.FilterInstance(global.meCore.projects[instanceName]);
};

module.exports.Mongoose = {
  Schema: Mongoose.Schema
};

module.exports.Joi = require('@hapi/joi');

module.exports.Utility = Utility;
