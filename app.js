const express               = require('express'),
      app                   = express(),
      bodyParser            = require('body-parser'),
      cookieParser          = require('cookie-parser'),
      Cookiesession         = require('./classes/cookie-session.class'),
      key                   = require('./key'),
      secret                = require('./secret'),
      KrakenClient          = require('@warren-bank/node-kraken-api'),
      kraken                = new KrakenClient(key, secret, {timeout: 10000});

const cookieSession = new Cookiesession();

/* middleware */
app.use(bodyParser.json());
app.use(cookieParser());
app.use(new Cookiesession().middleware());

let usersCurrencies = {
  'default': [
    'Bitcoin (XBT)',
    'Bitcoin Cash (BCH)',
    'Ether (ETH)',
    'Monero (XMR)'
  ]
};

let allKraken = [];
let currentRate = {};
let highRate = {};

app.get('/allKrakenCurrencies', (req,res) => {
  res.send(allKraken);
});

app.get('/currentRate', (req,res) => {
  let response = {};
  let userId = Object.values(req.cookies)[0];
  let theArray = usersCurrencies[userId] || usersCurrencies['default'];

  theArray.forEach(r => {
    response[r] = currentRate[r];
  });

  res.send(response);
});

app.get('/highRate', (req,res) => {
  let response = {};
  let userId = Object.values(req.cookies)[0];
  let theArray = usersCurrencies[userId] || usersCurrencies['default'];

  theArray.forEach(r => {
    response[r] = highRate[r];
  });

  res.send(response);
});

app.post('/currentRate', (req,res) => {
  let userId = Object.values(req.cookies)[0];

  usersCurrencies[userId] = req.body.add;
  res.send(usersCurrencies[userId]);
});

function allKrakenCurrencies(res) {
  kraken.api('Ticker', { 'pair': 'XBTEUR,BCHEUR,DASHEUR,ETCEUR,ETHEUR,LTCEUR,REPEUR,XMREUR,XRPEUR,ZECEUR' }).then((res) => {
    allKraken['Augur (REP)'] = res["XREPZEUR"];
    allKraken['Bitcoin (XBT)'] = res["XXBTZEUR"];
    allKraken['Bitcoin Cash (BCH)'] = res["BCHEUR"];
    allKraken['DASH (DASH)'] = res["DASHEUR"];
    allKraken['Ether (ETH)'] = res["XETHZEUR"];
    allKraken['Ether Classic (ETC)'] = res["XETCZEUR"];
    allKraken['Monero (XMR)'] = res["XXMRZEUR"];
    allKraken['Litecoin (LTC)'] = res["XLTCZEUR"];
    allKraken['Ripple (XPR)'] = res["XXRPZEUR"];
    allKraken['Zcash (ZEC)'] = res["XZECZEUR"];

    allKraken = Object.keys(allKraken);
  }).catch((err) => {
    allKrakenCurrencies();
  });
}

/* get current rates in euro */
function tickerCurrent(res) {
  kraken.api('Ticker', { 'pair': 'XBTEUR,BCHEUR,DASHEUR,ETCEUR,ETHEUR,LTCEUR,REPEUR,XMREUR,XRPEUR,ZECEUR' }).then((res) => {
    currentRate['Augur (REP)'] = res["XREPZEUR"]["c"].splice(0,1);
    currentRate['Bitcoin (XBT)'] = res["XXBTZEUR"]["c"].splice(0,1);
    currentRate['Bitcoin Cash (BCH)'] = res["BCHEUR"]["c"].splice(0,1);
    currentRate['DASH (DASH)'] = res["DASHEUR"]["c"].splice(0,1);
    currentRate['Ether (ETH)'] = res["XETHZEUR"]["c"].splice(0,1);
    currentRate['Ether Classic (ETC)'] = res["XETCZEUR"]["c"].splice(0,1);
    currentRate['Monero (XMR)'] = res["XXMRZEUR"]["c"].splice(0,1);
    currentRate['Litecoin (LTC)'] = res["XLTCZEUR"]["c"].splice(0,1);
    currentRate['Ripple (XPR)'] = res["XXRPZEUR"]["c"].splice(0,1);
    currentRate['Zcash (ZEC)'] = res["XZECZEUR"]["c"].splice(0,1);
  }).catch((err) => {
    // console.log(err);
  });
}

/* get 24h high rates in euro */
function tickerHigh(res) {
  kraken.api('Ticker', { 'pair': 'XBTEUR,BCHEUR,DASHEUR,ETCEUR,ETHEUR,LTCEUR,REPEUR,XMREUR,XRPEUR,ZECEUR' }).then((res) => {
    highRate['Augur (REP)'] = res["XREPZEUR"]["h"].splice(1,1);
    highRate['Bitcoin (XBT)'] = res["XXBTZEUR"]["h"].splice(1,1);
    highRate['Bitcoin Cash (BCH)'] = res["BCHEUR"]["h"].splice(1,1);
    highRate['DASH (DASH)'] = res["DASHEUR"]["h"].splice(1,1);
    highRate['Ether (ETH)'] = res["XETHZEUR"]["h"].splice(1,1);
    highRate['Ether Classic (ETC)'] = res["XETCZEUR"]["h"].splice(1,1);
    highRate['Monero (XMR)'] = res["XXMRZEUR"]["h"].splice(1,1);
    highRate['Litecoin (LTC)'] = res["XLTCZEUR"]["h"].splice(1,1);
    highRate['Ripple (XPR)'] = res["XXRPZEUR"]["h"].splice(1,1);
    highRate['Zcash (ZEC)'] = res["XZECZEUR"]["h"].splice(1,1);
  }).catch((err) => {
    // console.log(err);
  });
}

allKrakenCurrencies();

tickerCurrent();
setInterval(tickerCurrent, 3000);

tickerHigh();
setInterval(tickerHigh, 3000);

app.use(express.static(__dirname + '/www', {extensions:['html']}));
app.listen(3010, () => console.log('UP AND RUNNING ON PORT 3010!'));