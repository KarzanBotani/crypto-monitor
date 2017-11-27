const express = require('express'),
      app = express(),
      key          = require('./key'), // API Key
      secret       = require('./secret'), // API Private Key
      KrakenClient = require('@warren-bank/node-kraken-api'),
      kraken = new KrakenClient(key, secret, {timeout: 10});


function ticker() {

  let currentTime = new Date().toString();

  kraken.api('Ticker', { 'pair': 'XBTEUR' }).then((res) => {
    console.log('XBT / EUR: ', res);
  });

  kraken.api('Ticker', { 'pair': 'BCHEUR' }).then((res) => {
    console.log('BCH / EUR: ', res);
  });

  kraken.api('Ticker', { 'pair': 'ETHEUR' }).then((res) => {
    console.log('ETH / EUR: ', res);
  });

  kraken.api('Ticker', { 'pair': 'XMREUR' }).then((res) => {
    console.log('XMR / EUR: ', res);
  });
}

ticker();

setInterval(ticker, 1000 * 60 * 30);

app.use(express.static('./www'));
app.listen('3000', () => console.log('UP AND RUNNING ON PORT 3000!'));