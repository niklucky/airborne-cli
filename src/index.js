import commander from 'commander';

import DI from './lib/di';

import defaultConfig from './config';

class AirborneCli {
  constructor(config) {
    if (typeof config !== 'object') {
      throw new Error('config is not an object. Failed to start');
    }
    this.di = new DI();
    this.controllers = {};
    this.commander = null;
    this.input = null;
    this.config = Object.assign({}, defaultConfig, config);
    this.di.set('config', this.config);
    this.initCommander();
  }

  initCommander() {
    /* istanbul ignore next */
    this.commander = commander
        .version(this.config.version)
        .command('run [path] [params...]')
        .description(this.config.description)
        .option('-n', 'Params structured in object/array')
        .action((path, params, options) => (this.handleAction(path, params, options)));
  }

  set({ controllers }) {
    this.controllers = controllers;
    return this;
  }

  handle(input) {
    this.input = commander.parse(input);
  }

  handleAction(path, params, options) {
    if (path) {
      return this.dispatch(path, params, options);
    }
    return false;
  }

  dispatch(path, params, options) {
    const parsed = this.parsePath(path);
    const payload = this.parseParams(params, options.N);
    const ctrl = parsed.controller;
    const method = parsed.method;
    ctrl[method](payload);
    return true;
  }
  parseParams(params, isNamed) { // eslint-disable-line
    if (isNamed) {
      const data = {};
      params.forEach((param) => {
        if (param.indexOf('=') !== -1) {
          const [name, value] = param.split('=');
          data[name] = value;
        } else {
          const name = Object.keys(data).length;
          const value = param;
          data[name] = value;
        }
      });
      return data;
    }
    return params;
  }
  parsePath(path) {
    const [ctrl, methodName] = path.split('/');
    const Controller = this.getController(ctrl);
    if (Controller) {
      const controller = new Controller(this.di);
      const method = (!methodName) ? this.config.defaultMethod : methodName;
      if (controller[method]) {
        return {
          controller,
          method
        };
      }
      throw new Error('Method is not defined');
    }
    throw new Error('Controller is not defined');
  }
  getController(name) {
    const controllerName = `${name}Controller`;
    return this.controllers[controllerName];
  }
}

export default AirborneCli;
