//Get keyboard input

var curStr = ''
var ENTER = 13;
var DELETE = 46;
var BSPACE = 8;
var CTRL = 17;
var SUB = 45;
var ADD = 187;
var EQUALS = 32;
var curHTMLStr = document.getElementById('curStr');
var curGroup = 0;
var ctrlDown = false;

curHTMLStr.style.width = 100;
curHTMLStr.style.height = 100;


var material = new THREE.LineBasicMaterial({
	color: 0xffffff
})

//Listen for key down
document.addEventListener('keydown', function(event) {

	switch(event.keyCode){
		case ADD:
			if (operations.length == 0) {
				document.getElementById('expression').innerHTML = ""
				for (var l = 0; l < lines.length; l++) scene.remove(lines[l])
				lines = []
			}
			if (lastInd != null) {
				operations.push(words[lastInd].name)
				operations.push("+")
				var geometry = new THREE.Geometry()
		  	geometry.vertices.push(new THREE.Vector3().copy(math))
				math = math.add(words[lastInd].coordinates)
				geometry.vertices.push(new THREE.Vector3().copy(math))
				var line = new THREE.Line(geometry, material)
				lines.push(line)
				scene.add(line)
				string = ""
				operations.map(function(d,i){ string += d + "<br>" })
				document.getElementById('expression').innerHTML = string
			}
			return
		case SUB:
			if (operations.length == 0) {
				document.getElementById('expression').innerHTML = ""
				for (var l = 0; l < lines.length; l++) scene.remove(lines[l])
				lines = []
			}
			if (lastInd != null) {
				operations.push(words[lastInd].name)
				operations.push("-")
				var geometry = new THREE.Geometry()
				geometry.vertices.push(new THREE.Vector3().copy(math))
				math = math.sub(words[lastInd].coordinates)
				geometry.vertices.push(new THREE.Vector3().copy(math))
				var line = new THREE.Line(geometry, material)
				lines.push(line)
				scene.add(line)
				string = ""
				operations.map(function(d,i){ string += d + "<br>" })
				document.getElementById('expression').innerHTML = string
			}
			return
		case EQUALS:
			if (operations.length == 0) {
				document.getElementById('expression').innerHTML = ""
				for (var l = 0; l < lines.length; l++) scene.remove(lines[l])
				lines = []
			}
			if (lastInd != null) {
				operations.push(words[lastInd].name)
				operations.push("=")
				var geometry = new THREE.Geometry()
		  	geometry.vertices.push(new THREE.Vector3().copy(math))
				math = math.add(words[lastInd].coordinates)
				geometry.vertices.push(new THREE.Vector3().copy(math))
				var line = new THREE.Line(geometry, material)
				lines.push(line)
				scene.add(line)
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
			math = new THREE.Vector3(0,0,0)
			operations = []
			addWord(match)
			return
		case ENTER: //If enter, add word to graph
			var change = addWord(curStr, curGroup);
			curStr = change
			curHTMLStr.innerHTML = curStr;
			break
		case DELETE: //If delete, delete selected word.
			if(lastInd!=null){
			 removeWord(lastInd);
			 lastInd = null;
			}
			curHTMLStr.innerHTML = curStr;
			break
		case BSPACE: //if backspace, remove last character from word
			curStr = curStr.substring(0,curStr.length-1);
			break;
		case CTRL:
			curGroup+=1;
			senteces.push({sentence: curSentence, edges: edges});
			curSentence = [];
			edges = [];
			break;
		default: //Otherwise, add character to plot
			if (event.which != null){
				curStr = curStr + String.fromCharCode(event.keyCode);
			}
			curHTMLStr.innerHTML = curStr;

	}



});

document.addEventListener('keyup', function(event){
	switch(event.keyCode){
		case CTRL:
			ctrlDown = false;
	}

});
