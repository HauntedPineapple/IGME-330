export const loadJsonFetch = (url, callback) => {
  fetch(url)
    .then(response => {
      // If the response is successful, return the JSON
      if (response.ok) {
        return response.json();
      }

      // else throw an error that will be caught below
      return response.text().then(text =>{
        throw text;
      });
    }) // send the response.json() promise to the next .then()
    .then(json => { // the second promise is resolved, and `json` is a JSON object
      callback(json);
    }).catch(error => {
      // error
      console.log(error);
  });
};