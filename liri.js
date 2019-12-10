// Imports
require("dotenv").config();
const keys = require("./keys");
const Spotify = require("node-spotify-api");
const inquirer = require("inquirer");
const axios = require("axios");
const moment = require("moment");

var spotify = new Spotify(keys.spotify);
// var userQuery = `The Beatles Don't Let Me Down`

console.log(`Keys: 
  ${keys.spotify.id}
  ${keys.spotify.secret}`);

inquirer
	.prompt([
		{
			type: "input",
			message: "Input a Spotify search!",
			name: "userQuery"
		},
		{
			type: "confirm",
			message: "Continue with this search?",
			name: "confirm",
			default: true
		}
	])
	.then(function(response) {
		if (response.confirm) {
      console.log(`Spotify search!`);
			spotify.search(
				{
					type: `track`,
					query: response.userQuery
				},
				function(e, data) {
					if (e) {
						return console.log(`Error: ${e}`);
          }
          const items = data.tracks.items;
          console.log("Data:", data);
          console.log("Name:", JSON.stringify(data.name));
          for(var i = 0; i < items.length; i++) {
            const artist = items[i].artists[0].name;
            console.log(`Item: ${JSON.stringify(items[i].name)} - Artist: ${JSON.stringify(artist)}`);
          }
				}
			);
		}
  });