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

let currentRate = {};
let highRate = {};

let fiat = [
  { name: 'SEK', rate: '9.96' },
];

app.get('/fiat', (req,res) => {
  res.send(fiat);
  res.end();
});

/* keep */
app.get('/currentRate', (req,res) => {
  res.send(currentRate);
  res.end();
});

app.get('/highRate', (req,res) => {
  res.send(highRate);
  res.end();
});

/* get current rates in euro */
function tickerCurrent(res) {
  kraken.api('Ticker', { 'pair': 'XBTEUR,BCHEUR,ETHEUR,LTCEUR,XMREUR' }).then((res) => {
    currentRate['Bitcoin (XBT)'] = res["XXBTZEUR"]["c"].splice(0,1);
    currentRate['Bitcoin Cash (BCH)'] = res["BCHEUR"]["c"].splice(0,1);
    currentRate['Ether (ETH)'] = res["XETHZEUR"]["c"].splice(0,1);
    currentRate['Monero (XMR)'] = res["XXMRZEUR"]["c"].splice(0,1);

    console.log('current rate: ', currentRate);
  }).catch((err) => {
    console.log(err);
  });
}

/* get 24h high rates in euro */
function tickerHigh(res) {
  kraken.api('Ticker', { 'pair': 'XBTEUR,BCHEUR,ETHEUR,LTCEUR,XMREUR' }).then((res) => {
    highRate['Bitcoin (XBT)'] = res["XXBTZEUR"]["h"].splice(1,1);
    highRate['Bitcoin Cash (BCH)'] = res["BCHEUR"]["h"].splice(1,1);
    highRate['Ether (ETH)'] = res["XETHZEUR"]["h"].splice(1,1);
    highRate['Monero (XMR)'] = res["XXMRZEUR"]["h"].splice(1,1);

    console.log('24h high rate: ', highRate);
  }).catch((err) => {
    console.log(err);
  });
}

tickerCurrent();
setInterval(tickerCurrent, 3000);

tickerHigh();
setInterval(tickerHigh, 3000);

app.use(express.static(__dirname + '/www', {extensions:['html']} ));
app.listen(3010, () => console.log('UP AND RUNNING ON PORT 3010!'));