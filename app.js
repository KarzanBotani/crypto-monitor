const express               = require('express'),
      app                   = express(),
      bodyParser            = require('body-parser'),
      cookieParser          = require('cookie-parser'),
      Rest                  = require('./classes/rest.class'),
      Cookiesession         = require('./classes/cookie-session.class'),
      Login                 = require('./classes/login.class'),
      devPassword           = require('./dev-password'),
      CoinMarketCap         = require('coinmarketcap-api'),
      client                = new CoinMarketCap();

process.on('unhandledRejection', error=>console.log('unhandledRejection', error));

const cookieSession = new Cookiesession();

/* middleware */
app.use(bodyParser.json());
app.use(cookieParser());
app.use(new Cookiesession().middleware());

/* not middleware */
new Login(app);

/* MySQL connection */
app.use(Rest.start({
  dbCredentials: {
    host: '127.0.0.1',
    user: 'root',
    password: devPassword.unique(),
    database: 'crypto_monitor',
    multipleStatements: true
  },
  baseUrl: '/rest',
  idMap: {},
  runtimeErrors: false
}));

/* global variables */
let allInfo;

/* REST */
app.get('/allInfo', (req,res) => {
  res.send(allInfo);
});

/* fetch top 100 coins from Coinmarketcap */
function getEverything() {
  client.getTicker({ convert: 'USD' }).then((res) => {
    allInfo = res;
    // console.log(allInfo);
  }).catch(console.error);
}

getEverything();
setInterval(getEverything, 3000);

global.dbQuery = Rest.query;

app.use(express.static(__dirname + '/www', {extensions:['html']}));
app.listen(3010, () => console.log('UP AND RUNNING ON PORT 3010!'));