var output = document.getElementById('output');
var xAxis = new THREE.Vector3(1,0,0);
var yAxis = new THREE.Vector3(0,1,0);
var zAxis = new THREE.Vector3(0,0,1);

var curRoll=0,curYaw=0,curPitch=0;
var q = new THREE.Quaternion();
var firstFrame = null;
var baseZoom = null;
var baseFinger = null;


Leap.loop(function (frame) {
	if (!firstFrame && frame.hands[0]){
		firstFrame = frame;
		baseZoom = frame.hands[0].palmPosition[1];
	}

	//Check that
	if (frame.hands[0] && frame.hands[0].sphereRadius > 40){
	    frame.hands.forEach(function(hand, index){
	    	var numExtended = 0;
	    	var fingers = hand.fingers;
	    	for (var i=0; i<fingers.length; i++){
	    		var f = fingers[i];
	    		if (f.extended)
	    			numExtended +=1
	    	}
	    	if (numExtended == 1 && hand.indexFinger.extended){
	    		var direction = hand.indexFinger.distal.direction();
	    		if (baseFinger == null)
	    			baseFinger = hand.indexFinger.distal.direction();
	    		setRotation(direction[0] - baseFinger[0],direction[1] - baseFinger[1],direction[2] - baseFinger[2], 30);
	    		console.log(direction);
	    	}
	    	else{
	    		baseFinger = null;
	    	}

	    	 setRotation(hand.roll(), hand.pitch(), hand.yaw(), 30.0);
	    });
	}



  }).use('screenPosition', {scale: 0.25});

function setRotation(roll, pitch, yaw, precision){

	if (Math.abs(roll) > 0.4 && Math.abs(roll) > Math.abs(pitch) && Math.abs(roll) > Math.abs(yaw))
		rotateAroundWorldAxis( scene, zAxis, roll/precision );
		//camera.rotation.z -= roll/30.0;
		//cameraParent.rotation.z -= roll/30.0;
	if (Math.abs(pitch) > 0.4 && Math.abs(pitch) > Math.abs(roll) && Math.abs(pitch) > Math.abs(yaw))
		rotateAroundWorldAxis( scene, xAxis, pitch/precision ); //- pitch
		//camera.rotation.x += pitch/30.0;
	if (Math.abs(yaw) > 0.4 && Math.abs(yaw) > Math.abs(pitch) && Math.abs(yaw) > Math.abs(roll))
		rotateAroundWorldAxis( scene, yAxis, -yaw/precision );
		//camera.rotation.y -= yaw/30.0;

	//camera.lookAt(new THREE.Vector3(0,0,0));
	//console.log( "x: " + camera.position.x + ", y: " + camera.position.y + ", z: " + camera.position.z);
}



function setZoom(hand){
	if (hand){

		var curY = hand.palmPosition[1];
		if (Math.abs(baseZoom - curY) > 20){
			camera.position.z -= (baseZoom-curY)/5.0;
			updateText();
		}
	}
}

var rotWorldMatrix;
function rotateAroundWorldAxis( object, axis, radians ) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix);        // pre-multiply
    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
   	updateText();
}

/*function rotateObject(object, axis, angle){
	q.setFromAxisAngle( axis, angle ); // axis must be normalized, angle in radians
	object.quaternion.multiplyQuaternions( q, object.quaternion );
	//output.innerHTML = 'height: ' + camera.position.x;
}

function rotateCamera(axis, angle){


	camera.position.applyAxisAngle(axis, angle);
	camera.lookAt(scene.position);
	output.innerHTML = "x: " + camera.position.x + ", y: " + camera.position.y + ", z: " + camera.position.z;

}

function rotateY(object, rotSpeed){
		object.position.x = object.position.x * Math.cos(rotSpeed) + object.position.z * Math.sin(rotSpeed);
        object.position.z = object.position.z * Math.cos(rotSpeed) - object.position.x * Math.sin(rotSpeed);

}

function rotateX(object, rotSpeed){
		object.position.y = object.position.y * Math.cos(rotSpeed) + object.position.z * Math.sin(rotSpeed);
        object.position.z = object.position.z * Math.cos(rotSpeed) - object.position.y * Math.sin(rotSpeed);
}

function rotateZ(object, rotSpeed){
		object.position.x = object.position.x * Math.cos(rotSpeed) + object.position.y * Math.sin(rotSpeed);
        object.position.y = object.position.y * Math.cos(rotSpeed) - object.position.x * Math.sin(rotSpeed);
}*/
