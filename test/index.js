import { expect } from 'chai';
import AirborneCLI from '../src/index';
import DI from '../src/lib/di';

import { config, controllers, connections } from './mocks';

let app;

describe('Airborne CLI application', () => {
  describe('Invalid params', () => {
    it('All params are undefined', () => {
      app = () => new AirborneCLI();
      expect(app).to.throw(Error, /config is not an object. Failed to start/);
    });
  });
  describe('DI check', () => {
    it('Init', () => {
      const di = new DI();
      di.set('a', 1);
      expect(di.di).has.property('a');
      expect(di.di.a).is.equal(1);
    });
    it('Merge', () => {
      const di = new DI();
      const di2 = new DI();
      di.set('a', 1);
      di2.set('b', 2);
      di.merge(di2);
      expect(di.di).has.property('b');
      expect(di.di.b).is.equal(2);
    });
  });
  describe('Config presented', () => {
    beforeEach(() => {
      app = new AirborneCLI(config);
    });
    it('Check di', () => {
      expect(app).to.have.property('di');
      expect(app).to.have.property('config');
      expect(app.config).to.be.an('object');
      expect(app.di).to.be.an.instanceOf(DI);
      const c = app.di.get('config');
      expect(c.version).is.equal(config.version);
    });
    it('commander init', () => {
      expect(app).to.have.property('commander');
      expect(app.commander).to.be.an('object');
    });
    it('connections init', () => {
      expect(app).to.have.property('connections');
      expect(app.connections).to.be.an('object');
    });
  });
  describe('Controllers', () => {
    it('Set controllers', () => {
      expect(app).to.have.property('controllers');
      app.set({ controllers });
      expect(app.controllers).to.be.an('object');
      expect(app.controllers.TestController).to.be.an('function');
    });
  });
  describe('Connections', () => {
    it('Set connections', () => {
      expect(app).to.have.property('connections');
      app.set({ connections });
      expect(app.connections).to.be.an('object');
      expect(app.connections.mysql).to.be.an('object');
    });
  });
  describe('handle', () => {
    it('handle', () => {
      app.handle('Test');
      expect(app.input).to.be.an('object');
    });
    it('handleAction', () => {
      const result = app.handleAction('Test/start', [], false);
      expect(result).to.be.equal(true);
    });
    it('handleAction — no path', () => {
      const result = app.handleAction('', [], false);
      expect(result).to.be.equal(false);
    });
    it('handleAction — with params', () => {
      const result = app.handleAction('Test/start', ['id=3'], { N: true });
      expect(result).to.be.equal(true);
    });
    it('handleAction — with params', () => {
      const result = app.handleAction('Test', ['id=3'], { N: true });
      expect(result).to.be.equal(true);
    });
    it('parseParams — with named', () => {
      const result = app.parseParams(['id=3'], true);
      expect(result).has.property('id');
      expect(result.id).is.equal('3');
    });
    it('parseParams — with named', () => {
      const result = app.parseParams(['3'], true);
      expect(result).has.property('0');
      expect(result[0]).is.equal('3');
    });
    it('getController', () => {
      const result = app.getController('Test');
      expect(result).to.be.an('function');
      expect(result).is.equal(app.controllers.TestController);
    });
    it('handleAction — undefined controller', () => {
      const fn = () => app.handleAction('NewTest/start', ['id=3'], { N: true });
      expect(fn).to.throw(Error, /Controller is not defined/);
    });
    it('handleAction — undefined method', () => {
      const fn = () => app.handleAction('Test/undefined', ['id=3'], { N: true });
      expect(fn).to.throw(Error, /Method is not defined/);
    });
  });
});
