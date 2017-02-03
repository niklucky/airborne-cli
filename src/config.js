export default {
  version: '0.0.0',
  description: 'CLI programm placeholder. Update in config',
  debug: true,
  defaultMethod: 'start',
  db: {
    mysql: {
      host: '192.168.99.100',
      port: 3306,
      driver: 'mysql',
      password: '12345',
      database: 'AirborneTest'
    }
  },
  sources: {
    dictionary: 'dictionary'
  }
};
