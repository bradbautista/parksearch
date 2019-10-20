'use strict';

//key updated to NPS
const apiKey = '6GHoIVXc4bv4HLV43CE9ZxDZtPGyHbac3Qb48ju3';
const endpoint = 'https://developer.nps.gov/api/v1/parks';


function displayResults(responseJson) {
  // if there are previous results or errors, remove them
  console.log(responseJson);
  $('#results-list').empty();
  $('#js-error-message').empty();

  let imgString = 'responseJson.data[i].images[0].url';

  // iterate over the response
  for (let i = 0; i < responseJson.data.length ; i++){

    if (responseJson.data[i].images.length === 0) {
      $('#results-list').append(
        `<li><h3><a href="${responseJson.data[i].url}">${responseJson.data[i].name}</a></h3>
        <p class="address">${responseJson.data[i].addresses[0].line1}, ${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode} ${responseJson.data[i].addresses[0].postalCode}</p>
        <p>${responseJson.data[i].description}</p>
        </li>
        <hr>`);
      } else {
      $('#results-list').append(
        `<li><h3><a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].name}</a></h3>
        <p class="address">${responseJson.data[i].addresses[0].line1}, ${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode} ${responseJson.data[i].addresses[0].postalCode}</p>
        <p>${responseJson.data[i].description}</p>
        <img src="${responseJson.data[i].images[0].url}">
        </li>
        <hr>`);
      };

    console.log(responseJson.data[i].images.length);

    // for each park in the responseJson, list its name as a link
    // to its NPS page, provide a description of the park and
    // provide an image of the park

    // $('#results-list').append(
    //   `<li><h3><a href="${responseJson.data[i].url}">${responseJson.data[i].name}</a></h3>
    //   <p class="address">${responseJson.data[i].addresses[0].line1}, ${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode} ${responseJson.data[i].addresses[0].postalCode}</p>
    //   <p>${responseJson.data[i].description}</p>
    //   <img src="${imgString}">
    //   </li>
    //   <hr>`
    // )};
  //display the results section  
  $('#results').removeClass('hidden');
  };
};

function getParks(selectedStates, maxResults) {
  
  const maxResultsString = `limit=${maxResults}`;
  const apiKeyString = `api_key=${apiKey}`;
  const statesString = `stateCode=${selectedStates}`;
  const plusFields = 'fields=images,addresses';
  const params = [statesString, maxResultsString, plusFields, apiKeyString];
  const queryString = params.join('&');
  const url = endpoint + '?' + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {

  $('form').submit(event => {
    event.preventDefault();
    const maxResults = $('#js-max-results').val();
    // Returns csv of two-character state codes for checked boxes
    const selectedStates = $('input[type=checkbox]:checked').map(function() {
      return this.id;
    }).get().join(',');
    getParks(selectedStates, maxResults);
    // Clear the inputs and disable the submit button
    $('input:checkbox').prop('checked', false);
    $('input[type=submit').prop('disabled', true);
  });
}

function requireCheckbox() {
  const submitButt = $('input[type=submit]');
  const checkboxes = $('input[type=checkbox]');  
  checkboxes.click(function() {
  submitButt.attr('disabled', !checkboxes.is(':checked'));
  });

}

$(watchForm);
$(requireCheckbox);