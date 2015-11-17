/* Reads JSON file into JavaScript */

// Dictionary of words in data
var dictionary

readInModel()
console.log("Model loaded")

// Store in dictionary
function readInModel() {
	dictionary = JSON.parse(data)[0]
}
