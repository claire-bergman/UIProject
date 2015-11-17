

document.addEventListener('click', onMouseDown, false);
document.addEventListener('click', onMouseClick, false);
document.addEventListener("mousewheel", onMouseWheel, false);
document.addEventListener("DOMMouseScroll", onMouseWheel, false);
document.addEventListener("mousemove", onMouseMove, false);
document.addEventListener("mousedown", onMouseDown, false);
document.addEventListener("mouseup", onMouseUp, false);

var lastInd = null;
var mousePos, isDown;

function onMouseClick(e) {

	var curDist = 50;
	var curInd = null;
	for (var i=0; i<words.length; i++){
		var vec =  toXYCoords (words[i].coordinates);
		console.log("Vec: x: " + vec.x + ", y: " + vec.y);
		console.log("Mouse: x: " + e.clientX + ", y: " + e.clientY);
		console.log("distance: " +  (Math.pow(vec.x-e.clientX, 2) + Math.pow(vec.y-e.clientY, 2)));
		if ((Math.pow(vec.x-e.clientX, 2) + Math.pow(vec.y-e.clientY, 2)) < curDist){
			curDist = Math.pow(vec.x-e.clientX, 2) + Math.pow(vec.y-e.clientY, 2);
			curInd = i;
			console.log("Found at index: ", curInd);
		}

	}
	if (curInd != null){
		if (lastInd !=null)
			words[lastInd].html.className = 'label'
			words[curInd].html.className = 'bright label'
			lastInd = curInd;
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


//Takes care of zooming when the wheel is scrolled
function onMouseWheel(e){
	var delta = e.detail? e.detail*-2: e.wheelDelta/20.0;
	console.log(delta);
	camera.position.z -= delta;
	updateText();
	e.preventDefault();
	return false;
}


//Called whenever the mouse moves
function onMouseMove(e){
	//Get mouse coordinates
    e  = e || window.event;
    var temp = mouseCoords(e);

    //translate camera if mouse held
    if (isDown){
	    camera.position.x += mousePos.x  - temp.x;
	    camera.position.y += temp.y - mousePos.y;
	    updateText();
	 }

	mousePos = temp;
}

//Used by mouseMove to get the coordinates
function mouseCoords(e){
    if(e.pageX || e.pageY){
        return {x:e.pageX, y:e.pageY};
	}
    return {
        x:e.clientX + document.body.scrollLeft - document.body.clientLeft,
        y:e.clientY + document.body.scrollTop  - document.body.clientTop
    };
}

function onMouseDown(e){
	isDown = true;
}

function onMouseUp(e){
	isDown = false;
}
