//Get keyboard input

var curStr = ''
var ENTER = 13;
var DELETE = 46;

//Listen for key down
document.addEventListener('keydown', function(event) {
	//If enter, add word to plot, empty word string
	if (event.keyCode == ENTER){
		console.log(curStr);
		addWord(curStr);
		curStr = '';
	}

	//if delete, delte selected object
	else if(event.keyCode==DELETE){
		if(lastInd!=null){
			 removeWord(lastInd);
			 lastInd = null;
		}
	}

	//Otherwise, assume letter, add to word string. 
	else if (event.which != null){
		curStr = curStr + String.fromCharCode(event.keyCode);
	}
});