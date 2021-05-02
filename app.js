const Srf = require('drachtio-srf');
const srf = new Srf();
const opts = Object.assign({
  timestamp: () => {return `, "time": "${new Date().toISOString()}"`;}
}, {level: process.env.LOGLEVEL || 'info'});
const logger = require('pino')(opts);
const argv = require('minimist')(process.argv.slice(2));

const usage = () => {
  console.log('Usage: node app <sip-uri>');
  process.exit(0);
};

if (0 === argv._.length) usage();
const sipuri = argv._[0];

srf.connect({
  host: process.env.DRACHTIO_HOST || '127.0.0.1',
  port: process.env.DRACHTIO_PORT || 9022,
  secret: process.env.DRACHTIO_SECRET || 'cymru'
});
srf.on('connect', async(err, hp) => {
  if (err) return logger.error({err}, 'Error connecting to drachtio');
  logger.info(`sending OPTIONS ping to ${sipuri}`);
  try {
    await srf.request(sipuri, {method: 'OPTIONS'});
  } catch (err) {
    console.error(err, 'Error sending OPTIONS ping');
  }
  process.exit(0);
});

