let cryptoInfo;

$(document).ready(() => {
  getInfo();
  setInterval(getInfo, 1000 * 60);

  login();
  register();
});

function getInfo() {
  get('/allInfo', (data) => {
    cryptoInfo = data;
    renderAll();
  });
}

function get(url, callback) {
  $.ajax({
    url: url,
    type: 'get',
    cache: false,
    processData: false,
    success: callback
  });
}

function del(url, callback) {
  $.ajax({
    url: url,
    type: 'delete',
    cache: false,
    processData: false,
    success: callback
  });
}

function post(url, properties, callback) {
  $.ajax({
    url: url,
    type: 'post',
    beforeSend: function(xhr) {
      // Fix a bug (console error) in some versions of firefox
      if (xhr.overrideMimeType) {
        xhr.overrideMimeType('application/json');
      }
    },
    dataType: 'json',
    processData: false,
    headers: {'Content-Type': 'application/json'},
    data: JSON.stringify(properties),
    // callback functions
    success: callback,
    error: function(error) {
      callback({_error:error.responseJSON});
    }
  });
}

function renderAll() {
  $('#append-all').empty();

  for (let key in cryptoInfo) {
    let rank = cryptoInfo[key].rank;
    let symbol = cryptoInfo[key].symbol;
    let name = cryptoInfo[key].name;
    let dollarValue = cryptoInfo[key].price_usd;
    dollarValue = Number(dollarValue).toLocaleString();

    let marketCap = cryptoInfo[key].market_cap_usd;
    marketCap = Number(marketCap).toLocaleString();

    let availableSupply = cryptoInfo[key].available_supply;
    availableSupply = Number(availableSupply).toLocaleString();

    let percentChange = cryptoInfo[key].percent_change_24h;

    let row = $('<div class="row no-gutters r-style all-info">');
    let rankDiv = $('<div class="col-1 col-sm-1 col-md-1 rank-div">');
    let nameDiv = $('<div class="col-4 col-sm-3 col-md-2 name-div">');
    let dollarValueDiv = $('<div class="col-4 col-sm-2 col-md-2 text-right value-div">');
    let marketCapDiv = $('<div class="col-2 col-sm-3 col-md-3 hidden-sm-down text-right market-div">');
    let availableSupplyDiv = $('<div class="col-2 col-md-2 hidden-md-down text-right supply-div">');
    let percentChangeDiv = $('<div class="col-2 col-sm-2 col-md-2 text-right percent-div">');

    rankDiv.text(rank);
    nameDiv.text(name);
    dollarValueDiv.text('$' + dollarValue);
    marketCapDiv.text('$' + marketCap);
    availableSupplyDiv.text('$' + availableSupply);
    percentChangeDiv.text(percentChange);

    row.append(rankDiv);
    row.append(nameDiv);
    row.append(dollarValueDiv);
    row.append(marketCapDiv);
    row.append(availableSupplyDiv);
    row.append(percentChangeDiv);

    $('#append-all').append(row);
  }
}

function login() {
  $('.login-button').on('click', function() {
    if ($('#signup-div').hasClass('d-none')) {
      $('#main-div').toggleClass('d-none');
      $('#login-div').toggleClass('d-none');
    }

    else if (!$('#signup-div').hasClass('d-none')) {
      $('#signup-div').toggleClass('d-none');
      $('#login-div').toggleClass('d-none');
    }
  });

  let emailInput = $('#email-login').val();
  let passwordInput = $('#password-login').val();

  get('/rest/login', (data) => {
    if (data.user) {
      $('.login-button').toggleClass('d-none');
      $('.logout-button').toggleClass('d-none');
    }
  });

  $('.logout-button').on('click', function() {
    del('/rest/login', (data) => {
      $('.login-button').toggleClass('d-none');
      $('.logout-button').toggleClass('d-none');
    });
  })

  $('.login-submit').on('click', function() {
    post('/rest/login', { "email": emailInput, "password": passwordInput }, (data) => {
      // console.log(data);
      if (data.user) {
        $('.login-button').toggleClass('d-none');
        $('.logout-button').toggleClass('d-none');
        $('#login-div').toggleClass('d-none');
        $('#main-div').toggleClass('d-none');
      }
    });
  });
}

function register() {
  $('.signup-button').on('click', function() {
    $('#login-div').toggleClass('d-none');
    $('#signup-div').toggleClass('d-none');
  });

  $('.go-login-button').on('click', function() {
    $('#login-div').toggleClass('d-none');
    $('#signup-div').toggleClass('d-none');
  });

  let emailInput = $('#email-register').val();
  let passwordInput = $('#password-register').val();

  $('.signup-submit').on('click', function() {
    post('/rest/users', { email: emailInput, "password": passwordInput }, (data) => {
      // console.log(data);
      $('.login-button').toggleClass('d-none');
      $('.logout-button').toggleClass('d-none');
      $('#signup-div').toggleClass('d-none');
      $('#main-div').toggleClass('d-none');
    });
  });
}