//For reading in the Json


var dictionary;

readInModel();
console.log("Model loaded");


//Store in dictionary
function readInModel(){
	dictionary = JSON.parse(data)[0];
	console.log(dictionary.the);
}

