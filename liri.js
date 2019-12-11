// Imports
require("dotenv").config();

const fs = require("mz/fs");
const keys = require("./keys");
const Spotify = require("node-spotify-api");
const inquirer = require("inquirer");
const axios = require("axios");
const moment = require("moment");
const termLink = require("terminal-link");

const spotify = new Spotify(keys.spotify);
const omdbKey = `18d13de9`;

// helper function
const parseInput = str => {
	let command = str;

	if (command.includes(",")) {
		command = str.replace(/[,]/g, " ");
	}

	command = command.split(" ");
	let query = command.slice(1).join(" ");
	command = command[0];

	console.log(`${command}, ${query}`);

	return [command, query];
};

// function to run commandFunction(query)
const runCommand = (command, query) => {
	switch (command) {
		case "spotify-this-song":
			if (query) {
				spotifySearch(query);
			} else {
				spotifySearch("The Sign Ace of Base");
			}

			break;

		case "movie-this":
			if (query) {
				movieSearch(query);
			} else {
				movieSearch("Mr. Nobody");
			}

			break;

		case "concert-this":
			if (query) {
				concertSearch(query);
			} else {
				console.log(`You must enter a search query.`);
			}

			break;

		case "do":
			// case "do-what-it-says":
			doWhat();
			break;

		default:
			console.log(`You must enter a command.`);
			console.log(`Commands are the following:`);
			console.log(`spotify-this <search query>`);
			console.log(`concert-this <search query>`);
			console.log(`movie-this <search query>`);
			console.log(`do-what-it-says to run a command and query from a file`);
			break;
	}
	search();
};

const doWhat = async () => {
	try {
		const result = await fs.readFile("./random.txt", "utf8");
		// console.log(result);
		let input = parseInput(result);

		let command = input[0];
		let query = input[1];

		runCommand(command, query);
	} catch (error) {
		console.log(error);
	}
};

const spotifySearch = async searchQuery => {
	try {
		const result = await spotify.search({
			type: `track`,
			query: searchQuery
		});

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
	} catch (error) {
		console.error(error);
		console.log(`Response error :( try again.`);
	}
};

const movieSearch = async searchQuery => {
	const queryURL = `http://www.omdbapi.com/?t=${searchQuery}&apikey=${omdbKey}`;
	try {
		console.log("-----------------------------------------------");

		const response = await axios.get(queryURL);
		const data = response.data;

		const title = data.Title;
		const year = data.Year;
		const imdbRating = data.Ratings[0].Value;
		const rottenTomatoesRating = data.Ratings[1].Value;
		const country = data.Country;
		const language = data.Language;
		const plot = data.Plot;
		const actors = data.Actors;

		console.log(`Title: ${title}`);
		console.log(`Release year: ${year}`);
		console.log(`IMDB Rating: ${imdbRating}`);
		console.log(`Rotten Tomatoes Rating: ${rottenTomatoesRating}`);
		console.log(`Country Produced: ${country}`);
		console.log(`Languages: ${language}`);
		console.log(`Synopsis: ${plot}`);
		console.log(`Notable Actors: ${actors}`);
		console.log("-----------------------------------------------");
	} catch (error) {
		console.error(error);
		console.log(`Response error :( try again.`);
	}
};

const concertSearch = async searchQuery => {
	const queryURL = `https://rest.bandsintown.com/artists/${searchQuery}/events?app_id=codingbootcamp`;

	try {
		const result = await axios.get(queryURL);
		// ease of access to relevant nested object
		const data = result.data;

		console.log("-----------------------------------------------");
		for (let i = 0; i < data.length; i++) {
			const venue = data[i].venue;
			let datetime = data[i].datetime;
			datetime = moment(datetime).format(`MM/DD/YYYY`);

			const name = venue.name;
			const country = venue.country;
			const city = venue.city;
			const region = venue.region;

			console.log(`Venue: ${name}`);
			console.log(`Location: ${city}, ${region}, ${country}`);
			console.log(`Date: ${datetime}`);
			console.log("-----------------------------------------------");
		}
	} catch (error) {
		console.error(error);
		console.log(`Response error :( try again.`);
	}
};

const search = () => {
	inquirer
		.prompt([
			{
				type: "input",
				message: "Input a command!",
				name: "command"
			}
		])
		.then(function(response) {
			// separating command from query
			const input = parseInput(response.command);
			const command = input[0];
			const query = input[1];
			runCommand(command, query);
		});
};

search();
