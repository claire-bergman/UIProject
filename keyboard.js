//Get keyboard input

var curStr = ''
var ENTER = 13;

//Listen for key down
document.addEventListener('keydown', function(event) {
	//If enter, add word to plot, empty word string
	if (event.keyCode == ENTER){
		console.log(curStr);
		addWord(curStr);
		curStr = '';
	}

	//Otherwise, assume letter, add to word string. 
	else if (event.which != null){
		curStr = curStr + String.fromCharCode(event.keyCode);
	}
});