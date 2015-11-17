/* Handles mouse input */

// Add event listeners for each mouse event
document.addEventListener('click', onMouseDown, false);
document.addEventListener('click', onMouseClick, false);
document.addEventListener("mousewheel", onMouseWheel, false);
document.addEventListener("DOMMouseScroll", onMouseWheel, false);
document.addEventListener("mousemove", onMouseMove, false);
document.addEventListener("mousedown", onMouseDown, false);
document.addEventListener("mouseup", onMouseUp, false);

// Keep track of mouse states
var mousePos 		// mouse position
var isDown			// whether pressed

// Mouse click handler
function onMouseClick(e) {

	isDown = false;
	var curDist = 50;
	var curInd = null;

	// Need to loop through all of the words when the mouse is clicked
	for (var i=0; i<words.length; i++){
		var vec =  toXYCoords (words[i].coordinates);
		console.log("Vec: x: " + vec.x + ", y: " + vec.y);
		console.log("Mouse: x: " + e.clientX + ", y: " + e.clientY);
		console.log("distance: " +  (Math.pow(vec.x-e.clientX, 2) + Math.pow(vec.y-e.clientY, 2)));
		// If a word-node is close enough, save it as the current selection
		if ((Math.pow(vec.x-e.clientX, 2) + Math.pow(vec.y-e.clientY, 2)) < curDist){
			curDist = Math.pow(vec.x-e.clientX, 2) + Math.pow(vec.y-e.clientY, 2);
			curInd = i;
			console.log("Found at index: ", curInd);
		}
	}

	// Now if a close node was found...
	if (curInd != null) {
		if (lastInd != null)
			// Toggle all other nodes to de-selected
			words[lastInd].html.className = 'label'
			// Toggle this node to selected
			words[curInd].html.className = 'bright label'
			// Set this node as the most recently selected one
			lastInd = curInd
	}


/*var vectorMouse = new THREE.Vector3( //vector from camera to mouse
    -(window.innerWidth/2-e.clientX)*2/window.innerHeight,
    (window.innerHeight/2-e.clientY)*2/window.innerHeight,
    -1/Math.tan(22.5*Math.PI/180)); //22.5 is half of camera frustum angle 45 degree
vectorMouse.applyQuaternion(camera.quaternion);
vectorMouse.normalize();

var vectorObject = new THREE.Vector3(); //vector from camera to object
vectorObject.set(object.x - camera.position.x,
                 object.y - camera.position.y,
                 object.z - camera.position.z);
vectorObject.normalize();
if (vectorMouse.angleTo(vectorObject)*180/Math.PI < 1) {
    //mouse's position is near object's position
}*/


}

// Mouse wheel handler
function onMouseWheel(e){

	// Get amount of zoom
	var delta = e.detail? e.detail*-2: e.wheelDelta/20.0;
	console.log(delta);

	// Update camera z position to this amount, which is like zooming
	camera.position.z -= delta;

	// Update labe,s
	updateText();

	e.preventDefault();
	return false;

}


// Mouse move handler
function onMouseMove(e){

	// Get mouse coordinates
  e  = e || window.event;
  var temp = mouseCoords(e);

  // Translate camera if mouse held
  if (isDown){
    camera.position.x += mousePos.x  - temp.x;
    camera.position.y += temp.y - mousePos.y;
		// Update text
    updateText();
 }

	// Keep track of mouse position
	mousePos = temp;

}

// Used by mouseMove to get the coordinates
function mouseCoords(e) {
  if(e.pageX || e.pageY){
      return {x:e.pageX, y:e.pageY};
	}
  return {
      x:e.clientX + document.body.scrollLeft - document.body.clientLeft,
      y:e.clientY + document.body.scrollTop  - document.body.clientTop
  };
}

// Mouse down handler
function onMouseDown(e){
	isDown = true;
}

// Mouse up handler
function onMouseUp(e){
	isDown = false;
}
