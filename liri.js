// Imports
require("dotenv").config();
const keys = require("./keys");
const Spotify = require("node-spotify-api");
const inquirer = require("inquirer");
const axios = require("axios");
const moment = require("moment");
const termLink = require("terminal-link");

var spotify = new Spotify(keys.spotify);

// console.log(`Keys:
//   ${keys.spotify.id}
//   ${keys.spotify.secret}`);

const spotifySearch = async searchQuery => {
	try {
		const result = await spotify.search({
			type: `track`,
			query: searchQuery
		});
		// console.log(JSON.stringify(result.tracks, null, 2));
		const items = result.tracks.items;
		console.log("\n-----------------------------------------------");

		for (let i = 0; i < items.length; i++) {
			// variables for ease of access & readability
			const previewURL = items[i].preview_url;
			const trackName = items[i].name;
			const artist = items[i].artists[0].name;

			// With iTerm, will create a clickable link. Command + click "Preview Link"
			// Otherwise will show as Preview Link (<preview URL>)
			const previewLink = termLink("Preview Link", previewURL);

			// validating all relevant object fields
			if (previewURL && trackName && artist) {
				console.log(
					`Artist: ${JSON.stringify(artist)}\nTrack: ${JSON.stringify(
						trackName
					)}`
				);
				console.log(previewLink);
				console.log("-----------------------------------------------");
			}
		}
		search();
	} catch (error) {
		console.log(error);
	}
};

const bandsInTownSearch = async searchQuery => {
	var queryURL = `https://rest.bandsintown.com/artists/${searchQuery}/events?app_id=codingbootcamp`;

	try {
		const result = await axios.get(queryURL);
		console.log(JSON.stringify(result));
	} catch (error) {
		console.error(error);
	}
};

const search = () => {
	inquirer
		.prompt([
			{
				type: "input",
				message: "Input a Spotify search!",
				name: "userQuery"
			}
			// {
			// 	type: "input",
			// 	message: "Input a bands in town search!",
			// 	name: "bandsQuery"
			// }
		])
		.then(function(response) {
			console.log(`Spotify search!`);
			spotifySearch(response.userQuery);
			// search();
		});
};

search();
