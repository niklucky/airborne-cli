const AirborneCli = require('../../dist').default;

const config = require('./config.cli');
const controllers = require('./controllers');

const app = new AirborneCli(config);
app
  .set({ controllers, database: config.db })
  .handle(process.argv);
