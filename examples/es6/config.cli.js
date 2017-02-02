module.exports = {
  version: '0.1.0',
  description: 'Test example',
  debug: true,
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
