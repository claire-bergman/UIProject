/* Handles keyboard input */

// Keep track of the current search field string
var curStr = ''

// Keycodes for mapping keyboard input
var ENTER = 13;
var DELETE = 46;
var BSPACE = 8;
var CTRL = 17;
var SUB = 189;
var ADD = 187;
var EQUALS = 32;
var SHIFT = 16;

// Reference to text field object
var curHTMLStr = document.getElementById('curStr');
var ctrlDown = false;

curHTMLStr.style.width = 100;
curHTMLStr.style.height = 100;

// Material for drawing lines during expression building
var material = new THREE.LineBasicMaterial({
	color: 0xffffff
})

// Key down handler
document.addEventListener('keydown', function(event) {

	// Check key code
	switch(event.keyCode){

		// IMMEDIATELY return on shift because it can add characters to the input field
		case SHIFT:
			return

		// ADD operation
		case ADD:
			// If no operations have been added clear the expression listing and all lines
			if (operations.length == 0) {
				document.getElementById('expression').innerHTML = ""
				for (var l = 0; l < lines.length; l++) scene.remove(lines[l])
				lines = []
			}
			// If a node has been selected...
			if (selectedNodes.length==1) {
				// Add this operation to the expression listing
				operations.push(words[selectedNodes[0]].name)
				operations.push("+")
				// Add a line for this based on the previous state of the equation...
				var geometry = new THREE.Geometry()
		  		geometry.vertices.push(new THREE.Vector3().copy(math))
				math = math.add(words[selectedNodes[0]].coordinates)
				// ...and the current state of the equation
				geometry.vertices.push(new THREE.Vector3().copy(math))
				var line = new THREE.Line(geometry, material)
				lines.push(line)
				scene.add(line)
				// Update the operations listing
				string = ""
				operations.map(function(d,i){ string += d + "<br>" })
				document.getElementById('expression').innerHTML = string
			}
			return

		// SUBTRACT operation
		case SUB:
			// If no operations have been added clear the expression listing and all lines
			if (operations.length == 0) {
				document.getElementById('expression').innerHTML = ""
				for (var l = 0; l < lines.length; l++) scene.remove(lines[l])
				lines = []
			}
			// If a node has been selected...
			if (selectedNodes.length==1) {
				// Same basic process as ADD
				operations.push(words[selectedNodes[0]].name)
				operations.push("-")
				var geometry = new THREE.Geometry()
				geometry.vertices.push(new THREE.Vector3().copy(math))
				math = math.sub(words[selectedNodes[0]].coordinates)
				geometry.vertices.push(new THREE.Vector3().copy(math))
				var line = new THREE.Line(geometry, material)
				lines.push(line)
				scene.add(line)
				string = ""
				operations.map(function(d,i){ string += d + "<br>" })
				document.getElementById('expression').innerHTML = string
			}
			return

		// EQUALS operation
		case EQUALS:
			// If no operations have been added clear the expression listing and all lines
			if (operations.length == 0) {
				document.getElementById('expression').innerHTML = ""
				for (var l = 0; l < lines.length; l++) scene.remove(lines[l])
				lines = []
			}
			// If a node has been selected...
			if (selectedNodes.length==1) {
				// Same basic process as ADD and SUBTRACT
				operations.push(words[selectedNodes[0]].name)
				operations.push("=")
				var geometry = new THREE.Geometry()
		  	geometry.vertices.push(new THREE.Vector3().copy(math))
				math = math.add(words[selectedNodes[0]].coordinates)
				geometry.vertices.push(new THREE.Vector3().copy(math))
				var line = new THREE.Line(geometry, material)
				lines.push(line)
				scene.add(line)
				// But this time, iterate through all words
				var closest = Number.MAX_VALUE
				var match
				for (var word in dictionary) {
					var d = dictionary[word]
					distance = new THREE.Vector3(d[0], d[1], d[2]).multiplyScalar(50).distanceTo(math)
					// Keep the closest node to the resulting vector
					if (distance < closest) {
						closest = distance
						match = word
					}
				}
				// Push the closest node to the expression listing
				operations.push(match)
				string = ""
				operations.map(function(d,i){ string += d + "<br>" })
				document.getElementById('expression').innerHTML = string
			}
			// Reset operations to ready for the next equation
			math = new THREE.Vector3(0,0,0)
			operations = []
			// Add the closest node to the screen
			addWord(match)
			return

		// Enter to add a word to the screen from the text field
		case ENTER:
			var change = addWord(curStr);
			curStr = change
			break

		// Delete to remove a word from the screen
		case DELETE: //If delete, delete selected word.
			for (var i=0; i<selectedNodes.length; i++){
				removeWord(selectedNodes[i]);
			}
			selectedNodes = [];
			/*if(lastInd!=null){
			 removeWord(lastInd);
			 lastInd = null;
			}*/
			break

		// Backspace to remove a character from the search field
		case BSPACE:
			curStr = curStr.substring(0,curStr.length-1);
			event.preventDefault();
			break;
		case CTRL:
			ctrlDown = true;
			break
	 // Otherwise, add character to plot
		default:
			if (event.which != null){
				curStr = curStr + String.fromCharCode(event.keyCode);
			}

	}

	// Update the search field
	curHTMLStr.innerHTML = curStr;



});

// Key up handler
document.addEventListener('keyup', function(event){
	switch(event.keyCode){
		case CTRL:
			ctrlDown = false;
	}

});
