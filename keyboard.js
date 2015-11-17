//Get keyboard input

var curStr = ''
var ENTER = 13;
var DELETE = 46;
var BSPACE = 8;
var SUB = 45;
var ADD = 187;
var EQUALS = 32;
var curHTMLStr = document.getElementById('curStr');

curHTMLStr.style.width = 100;
curHTMLStr.style.height = 100;


//Listen for key down
document.addEventListener('keydown', function(event) {

	console.log(event.keyCode)

	switch(event.keyCode){
		case ADD:
			if (lastInd != null) {
				operations.push(texts[lastInd].innerHTML)
				operations.push("+")
				math = math.add(textCoords3D[lastInd])
				string = ""
				operations.map(function(d,i){ string += d + "<br>" })
				document.getElementById('expression').innerHTML = string
			}
			return
		case SUB:
			if (lastInd != null) {
				operations.push(texts[lastInd].innerHTML)
				operations.push("-")
				math = math.sub(textCoords3D[lastInd])
				string = ""
				operations.map(function(d,i){ string += d + "<br>" })
				document.getElementById('expression').innerHTML = string
			}
			math = new THREE.Vector3(0,0,0)
			return
		case EQUALS:
			if (lastInd != null) {
				operations.push(texts[lastInd].innerHTML)
				operations.push("=")
				math = math.add(textCoords3D[lastInd])
				console.log(math)
				var closest = Number.MAX_VALUE
				var match
				for (var word in dictionary) {
					var d = dictionary[word]
					distance = new THREE.Vector3(d[0], d[1], d[2]).multiplyScalar(50).distanceTo(math)
					if (distance < closest) {
						closest = distance
						match = word
					}
				}
				operations.push(match)
				string = ""
				operations.map(function(d,i){ string += d + "<br>" })
				document.getElementById('expression').innerHTML = string
			}
			return
		case ENTER: //If enter, add word to graph
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
