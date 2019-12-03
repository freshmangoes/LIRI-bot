// Imports
require("dotenv").config();
const keys = require("./keys");
const Spotify = require("node-spotify-api");
const axios = require("axios");
const moment = require("moment");

var spotify = new Spotify(keys.spotify);

var spotifyQueryURL = "https://api.spotify.com/v1/search?q=the%20ramones";

console.log(`Keys: 
  ${keys.spotify.id}
  ${keys.spotify.secret}`);

axios({
  method: "get",
  url: spotifyQueryURL,
  // responseType: "stream",
  data: {
    access_token: `${keys.spotify.id}:${keys.spotify.secret}`,
    token_type: "Bearer",
    scope: "user-read-private"
  }
})
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  });
