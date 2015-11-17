

document.addEventListener('click', onMouseDown, false);

function onMouseDown(e) {

	curDist = 50;
	curInd = null;
	for (var i=0; i<words.length; i++){
		var vec =  toXYCoords (words[i].coordinates);
		console.log("Vec: x: " + vec.x + ", y: " + vec.y);
		console.log("Mouse: x: " + e.clientX + ", y: " + e.clientY);
		console.log("distance: " +  Math.pow(vec.x-e.clientX, 2) + Math.pow(vec.Y-e.clientY, 2))
		if ((Math.pow(vec.x-e.clientX, 2) + Math.pow(vec.y-e.clientY, 2)) < curDist){
			curDist = Math.pow(vec.x-e.clientX, 2) + Math.pow(vec.y-e.clientY, 2);
			curInd = i;
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
