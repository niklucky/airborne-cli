#!/usr/bin/env node
import commander from 'commander';

import DI from './lib/di';
import DbAdapter from './lib/db.adapter';

import defaultConfig from './config';

class AirborneCli {
  constructor(config) {
    this.di = new DI();
    this.controllers = {};
    this.config = Object.assign({}, defaultConfig, config);
    this.di.set('config', this.config);

    this.initCommander();
  }

  initCommander() {
    commander
        .version(this.config.version)
        .command('run [path] [params...]')
        .description(this.config.description)
        .option('-n', 'Params structured in object/array')
        .action((path, params, options) => (this.handleAction(path, params, options)));
  }

  set({ controllers, database }) {
    this.controllers = controllers;
    if (database) {
      this.initDB(database);
    }
    return this;
  }

  initDB(dbConfig) {
    this.di.set('db', new DbAdapter(dbConfig));
    return this;
  }

  handle(input) { // eslint-disable-line
    commander.parse(input);
  }

  handleAction(path, params, options) {
    if (path) {
      this.dispatch(path, params, options);
    }
  }

  dispatch(path, params, options) {
    const func = this.parsePath(path);
    if (func) {
      const payload = this.parseParams(params, options.N);
      func(payload);
    }
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
    const [ctrl, method] = path.split('/');
    const controllerName = `${ctrl}Controller`;
    const Controller = this.controllers[controllerName];
    if (Controller) {
      const controller = new Controller(this.di);
      if (controller[method]) {
        return controller[method];
      }
      throw new Error('Method is not defined');
    }
    throw new Error('Controller is not defined');
  }
}

export default AirborneCli;
