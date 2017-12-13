let fiat,
    currentRate,
    highRate,
    currentCrypto,
    lastInput;

$(document).ready(() => {
  getRates();
  setInterval(getRates, 10000);

  $('#toggle-rates').on('click', function() {
    $('.high-t').toggleClass('d-none');
    $('.current-t').toggleClass('d-none');
    $('.high-rates').toggleClass('d-none');
    $('.current-rates').toggleClass('d-none');

    if ($('.high-t').hasClass('d-none')) {
      $('.currency-list-title').text('highest rates past 24h');
    } else {
      $('.currency-list-title').text('current rates');
    }
  });
});

function getRates() {
  $.ajax({
    url: 'https://api.fixer.io/latest?base=EUR',
    cache: true,
    method: 'get',
    success: (fixerData) => {

      fiat = fixerData;

      $.ajax({
        url: '/currentRate',
        cache: false,
        method: 'get',
        success: (rateData)=>{
          currentRate = rateData;
          renderCurrent();
          createDropdown();
        }
      });

      $.ajax({
        url: '/highRate',
        cache: false,
        method: 'get',
        success: (rateData)=>{
          highRate = rateData;
          renderHigh();
        }
      });

    }

  });
}

function renderCurrent () {
  let sekNumber = fiat.rates.SEK;

  $('#append-current').empty();

  for (let key in currentRate) {
    let value = currentRate[key][0] * 1;

    let row = $('<div class="row no-gutters r-style current-rates">');
    let name = $('<div class="col-5">');
    let sek = $('<div class="col-4 text-right">');
    let eur = $('<div class="col-3 text-right">');

    let sekVal = Math.round(sekNumber * value);
    sekVal = sekVal.toLocaleString('se-SE');

    let eurVal = Math.round(value);
    eurVal = eurVal.toLocaleString();

    name.text(key);
    sek.text(sekVal + ' SEK');
    eur.text('€' + eurVal);

    row.append(name);
    row.append(sek);
    row.append(eur);

    $('#append-current').append(row);
  }
}

function renderHigh() {
  let sekNumber = fiat.rates.SEK;

  $('#append-high').empty();

  for (let key in highRate) {
    let value = highRate[key][0] * 1;

    let row = $('<div class="row no-gutters r-style high-rates d-none">');
    let name = $('<div class="col-5">');
    let sek = $('<div class="col-4 text-right">');
    let eur = $('<div class="col-3 text-right">');

    let sekVal = Math.round(sekNumber * value);
    sekVal = sekVal.toLocaleString('se-SE');

    let eurVal = Math.round(value);
    eurVal = eurVal.toLocaleString();

    name.text(key);
    sek.text(sekVal + ' SEK');
    eur.text('€' + eurVal);

    row.append(name);
    row.append(sek);
    row.append(eur);

    $('#append-high').append(row);
  }
}

function select(crypto) {
  currentCrypto = crypto;

  let euro = Number(currentRate[currentCrypto][0]);
  let sekPerEuro = Number(fiat.rates.SEK);
  let sek = sekPerEuro * euro;

  if (lastInput == '#crypto-input') {
    let numberOfCoins = Number($(lastInput).val().replace(/\,/g, '.').replace(/[^\d.]/g, '')); // event.target = this.
    let euroVal = Number((euro * numberOfCoins).toFixed(2));
    let sekVal = Number((sek * numberOfCoins).toFixed(2));

    $('#eur-input').val(euroVal.toLocaleString('sv-SE'));
    $('#sek-input').val(sekVal.toLocaleString('sv-SE'));
  }

  else if (lastInput == '#eur-input') {
    let numberOfEuro = Number($(lastInput).val().replace(/\,/g, '.').replace(/[^\d.]/g, '')); // event.target = this.
    let cryptoVal = numberOfEuro / euro;
    let sekVal = numberOfEuro * sekPerEuro;
    sekVal = Number(sekVal.toFixed(2));

    $('#crypto-input').val(cryptoVal.toLocaleString('sv-SE'));
    $('#sek-input').val(sekVal.toLocaleString('sv-SE'));
  }

  else if (lastInput == '#sek-input') {
    let numberOfSek = Number($(lastInput).val().replace(/\,/g, '.').replace(/[^\d.]/g, '')); // event.target = this.
    let cryptoVal = (numberOfSek / sekPerEuro) / euro;
    let euroVal = numberOfSek / sekPerEuro;
    euroVal = Number(euroVal.toFixed(2));

    $('#crypto-input').val(cryptoVal.toLocaleString('sv-SE'));
    $('#eur-input').val(euroVal.toLocaleString('sv-SE'));
  }

  else {
    $('#crypto-input').val('1');
    $('#crypto-input').trigger('keyup');
  }

  $('#crypto-input').attr('placeholder', crypto);
}

function createDropdown() {

  $('.crypto-dropdown').empty();

  if (lastInput) {
    $(lastInput).trigger('keyup');
  } else if (currentCrypto) {
    $('#crypto-input').trigger('keyup');
  }

  for (let crypto in currentRate) {
    let listItem = $('<a class="dropdown-item">');
    listItem.text(crypto);

    listItem.on('click', function() {
      $('a').removeClass('active');
      $(this).addClass('active');

      $('.convert-input').prop('disabled', false);
      $('#crypto-label').text(crypto);

      $('.dropdown-toggle').text(crypto);
      select(crypto);
    });

    $('.crypto-dropdown').append(listItem);
  }

  $('.convert-input').on('keyup', function() {
    lastInput = '#' + $(this).attr('id');
  });

  $('#crypto-input').on('keyup', function() {
    let euro = Number(currentRate[currentCrypto][0]);
    let sekPerEuro = Number(fiat.rates.SEK);
    let sek = sekPerEuro * euro;

    let numberOfCoins = Number($(this).val().replace(/\,/g, '.').replace(/[^\d.]/g, '')); // event.target = this.

    let euroVal = Number((euro * numberOfCoins).toFixed(2));
    let sekVal = Number((sek * numberOfCoins).toFixed(2));

    $('#eur-input').val(euroVal.toLocaleString('sv-SE'));
    $('#sek-input').val(sekVal.toLocaleString('sv-SE'));
  });

  $('#eur-input').on('keyup', function() {
    let euro = Number(currentRate[currentCrypto][0]);
    let sekPerEuro = Number(fiat.rates.SEK);

    let numberOfEuro = Number($(this).val().replace(/\,/g, '.').replace(/[^\d.]/g, '')); // event.target = this.

    let cryptoVal = numberOfEuro / euro;
    let sekVal = numberOfEuro * sekPerEuro;
    sekVal = Number(sekVal.toFixed(2));

    $('#crypto-input').val(cryptoVal.toLocaleString('sv-SE'));
    $('#sek-input').val(sekVal.toLocaleString('sv-SE'));
  });

  $('#sek-input').on('keyup', function() {
    let euro = Number(currentRate[currentCrypto][0]);
    let sekPerEuro = Number(fiat.rates.SEK);

    let numberOfSek = Number($(this).val().replace(/\,/g, '.').replace(/[^\d.]/g, '')); // event.target = this.

    let cryptoVal = (numberOfSek / sekPerEuro) / euro;
    let euroVal = numberOfSek / sekPerEuro;
    euroVal = Number(euroVal.toFixed(2));

    $('#crypto-input').val(cryptoVal.toLocaleString('sv-SE'));
    $('#eur-input').val(euroVal.toLocaleString('sv-SE'));
  });

}




// create(properties,callback){

//   $.ajax({
//     url: this.baseUrl,
//     type: "POST",
//     beforeSend: function(xhr) {
//       // Fix a bug( console error) in some versions of firefox
//       if (xhr.overrideMimeType)
//         xhr.overrideMimeType("application/json");
//     },
//     dataType: "json",
//     // don't process the request body
//     processData: false,
//     // and tell Node that it is raw json
//     headers: {"Content-Type": "application/json"},
//     // the request body
//     data: JSON.stringify(properties),
//     // callback functions
//     success: callback,
//     error: function(error){
//       callback({_error:error.responseJSON});
//     }
//   });

// }

let currentTime = new Date().toString();