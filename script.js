'use strict';

//key updated to NPS
const apiKey = '6GHoIVXc4bv4HLV43CE9ZxDZtPGyHbac3Qb48ju3';

const endpoint = 'https://developer.nps.gov/api/v1/parks';


function displayResults(responseJson, maxResults) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate over the response
  for (let i = 0; i < responseJson[i].length & i < maxResults ; i++){
    // for each video object in the articles
    // array, add a list item to the results 
    // list with the article title, source, author,
    // description, and image
    $('#results-list').append(
      `<li><h3><a href="${responseJson[i].url}">${responseJson[i].name}</a></h3>
      <p>${responseJson.articles[i].description}</p>
      <img src='${responseJson.articles[i].images.url}'>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};

function getParks(selectedStates, maxResults) {
  
  const maxResultsString = `limit=${maxResults}`
  const params = [selectedStates, maxResultsString]
  const queryString = params.join('&');
  const url = endpoint + '?' + queryString;

  console.log(url);

  const options = {
    headers: new Headers({
      "X-Api-Key": apiKey})
  };

  fetch(url, options)
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
    console.log(selectedStates);
    getParks(selectedStates, maxResults);
    // Clear the inputs
    // $('input:checkbox').prop('checked', false);
  });
}

$(watchForm);