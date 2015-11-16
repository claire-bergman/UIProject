//shortcut for returning a vector3
function v(x,y,z){ 
	return new THREE.Vector3(x,y,z); 
}

//Things we may need to access later
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 10000 );
var renderer = new THREE.WebGLRenderer();
var cameraParent = new THREE.Object3D();
var pointGeo, points, mat;
var texts = [], textCoords3D = [];


//Performs the basic setup
function setUpScene(){

	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor(0xEEEEEE);
	renderer.clear();
	document.body.appendChild( renderer.domElement );


	camera.position.z = 100;


	//Creating scatter plot
	var scatterPlot = new THREE.Object3D();
	scene.add(scatterPlot);

	mat = new THREE.PointsMaterial(
			{vertexColors: true, size: 1.5});


	/*Creating points to add to scatterplot
	pointGeo = new THREE.Geometry();

	points = new THREE.Points(pointGeo, mat);

	scatterPlot.add(points);*/



	//Creating axis to add to scatterplot
	var axisGeo = new THREE.Geometry();



	axisGeo.vertices.push(
		v(-50, 0, 0), v(50, 0, 0),
		 	v(0, -50, 0), v(0, 50, 0),
			v(0, 0, -50), v(0, 0, 50)
	);

	var axisMat = new THREE.LineBasicMaterial({
		color: 0x000000
	});
	var axes = new THREE.LineSegments(axisGeo, axisMat);
	axes.type = THREE.Lines;
	scene.add(axes);

}










//Literally just renders right not
var render = function () {
	requestAnimationFrame( render );
	renderer.render(scene, camera);
};


//Adds a word to the plot
function addWord(word){
	//Make sure word is lower case
	word = word.toLowerCase();
	console.log(word);

	var newPointGeo = new THREE.Geometry();

	//Multiply by 50 right now for scaling - may change later
	var newPoint = new THREE.Vector3(dictionary[word][0],
		dictionary[word][1],dictionary[word][2]).multiplyScalar(50);

	newPointGeo.vertices.push(newPoint);
	//Current color is green, may change later
	newPointGeo.colors.push(new THREE.Color(0x00ff00));
	var points2 = new THREE.Points(newPointGeo, mat);
	scene.add(points2);

	//Adding label
	var text2 = document.createElement('div');
		document.body.appendChild(text2);
	text2.style.position = 'absolute';
	//text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
	text2.style.width = 100;
	text2.style.height = 100;
	//text2.style.backgroundColor = "blue";
	text2.innerHTML = word;
	var vec = toXYCoords(newPoint);



	text2.style.top = vec.y + 'px';
	text2.style.left = vec.x + 'px';
	texts.push(text2);
	textCoords3D.push(newPoint);

	render();

}

//Get screen coordinates of a 3d point
function toXYCoords (pos) {
		var raycaster = new THREE.Raycaster();
        var vector = new THREE.Vector3();
 		vector = pos.clone();

 		vector.applyAxisAngle(zAxis, scene.rotation.z);
 		vector.applyAxisAngle(yAxis, scene.rotation.y);
 		vector.applyAxisAngle(xAxis, scene.rotation.x);
    	vector.project(camera);

        vector.x = (vector.x + 1)/2 * window.innerWidth;
        vector.y = -(vector.y - 1)/2 * window.innerHeight;
        return vector;
}

//Adds test points
function addPts(){
	var newPointGeo = new THREE.Geometry();
	var point;
	for (var i=-50;i<50;i++){
		point = v(i,i,i);
		newPointGeo.vertices.push(point);
		newPointGeo.colors.push(new THREE.Color(0x00ff00));
	}
	var points2 = new THREE.Points(newPointGeo, mat);
	scene.add(points2);
}

function updateText(){


	for (var i=0; i<texts.length; i++){
			console.log("updating");
		var vec = toXYCoords(textCoords3D[i]);
		texts[i].style.top = vec.y + 'px';
		texts[i].style.left = vec.x + 'px';

	}

}



//"main function"
setUpScene();
//addPts();
render();







	
