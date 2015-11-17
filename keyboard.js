//Get keyboard input

var curStr = ''
var ENTER = 13;
var DELETE = 46;
var BSPACE = 8;
var curHTMLStr = document.getElementById('curStr');

curHTMLStr.style.width = 100;
curHTMLStr.style.height = 100;


//Listen for key down
document.addEventListener('keydown', function(event) {

	switch(event.keyCode){
		case ENTER: //If enter, add word to graph
			console.log(curStr);
			var change = addWord(curStr);
			curStr = change;
			break;
		case DELETE: //If delete, delete selected word.
			if(lastInd!=null){
			 removeWord(lastInd);
			 lastInd = null;
			}
			break;
		case BSPACE: //if backspace, remove last character from word
			curStr = curStr.substring(0,curStr.length-1);
			break;
		default: //Otherwise, add character to plot
			if (event.which != null){
				curStr = curStr + String.fromCharCode(event.keyCode);
			}

	}

	curHTMLStr.innerHTML = curStr;


});
