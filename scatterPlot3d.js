var xAxis = xAxis || new THREE.Vector3(1,0,0);
var yAxis = yAxis || new THREE.Vector3(0,1,0);
var zAxis = zAxis || new THREE.Vector3(0,0,1);

var lastInd = null

var added = {}
requestAnimationFrame(animate)
var math = new THREE.Vector3(0,0,0)
var operations = []
var lines = []

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
var words = []
var sentences = []


//Performs the basic setup
function setUpScene(){

	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor(0x000000);
	renderer.clear();
	document.body.appendChild( renderer.domElement );


	camera.position.z = 100;
	camera.lookAt(new THREE.Vector3(0, 0, 0))
	camera.target = new THREE.Vector3(0,0,0)

	//Creating scatter plot
	var scatterPlot = new THREE.Object3D();
	scene.add(scatterPlot);

	mat = new THREE.PointsMaterial(
			{vertexColors: true, size: 1.5});


	pointGeo = new THREE.Geometry();

	points = new THREE.Points(pointGeo, mat);

	scatterPlot.add(points);

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
}

//Adds a word to the plot
function addWord(word){
	//Make sure word is lower case
	word = word.toLowerCase();

	var newPointGeo = new THREE.Geometry();

	// word not found
	if (dictionary[word] == null) {
		document.getElementById('tip').innerHTML = "oops! that word wasn't found. what about..."
		var random = Math.floor(Math.random() * 3147)
		var example = ""
		var i = 0
		for (var word in dictionary) {
			i ++
			if (i >= random) {
				example = word
				break
			}
		}
		return example
	} else {
		document.getElementById('tip').innerHTML = "great! use leap motion to navigate"
	}

	var newPoint = new THREE.Vector3(dictionary[word][0],
	dictionary[word][1],dictionary[word][2]).multiplyScalar(50);

	if (added[word] != null) {
		moveToPoint(newPoint)
		return ""
	}

	newPointGeo.vertices.push(newPoint);
	//Current color is green, may change later
	newPointGeo.colors.push(new THREE.Color('rgb('
		+ parseInt(Math.abs(dictionary[word][0]) * 255) + ','
		+ parseInt(Math.abs(dictionary[word][1]) * 255) + ','
		+ parseInt(Math.abs(dictionary[word][2]) * 255) + ')'));
	var points2 = new THREE.Points(newPointGeo, mat);
	points2.name = word;
	scene.add(points2);

	//Adding label
	var text2 = document.createElement('div');
	document.body.appendChild(text2);
	if (lastInd != null) words[lastInd].html.className = 'label'
	text2.className = 'bright label'
	text2.innerHTML = word;
	var vec = toXYCoords(newPoint);
	var curObj = createWord(word, text2, newPoint, -1) // {name: word, html: text2, coordinates: newPoint, group: -1};
	words.push(curObj)
	lastInd = words.length - 1


	// orient camera
	moveToPoint(newPoint)

	render()

	added[word] = true

	return ""

}

function createWord(name, htmlText, coordinates, group){
	return {name: name, html: htmlText, coordinates: coordinates, group: group};
}

function removeWord(i){
	//remove from scene
	var word = words[i].name
	var object = scene.getObjectByName(word);
	scene.remove(object);

	//remove from html
	words[i].html.parentNode.removeChild(words[i].html);

	//Remove from lists
	words.splice(i, 1);

	//redraw
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

        vector.x = (vector.x + 1)/2 * renderer.getSize().width
        vector.y = -(vector.y - 1)/2 * renderer.getSize().height
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


	for (var i=0; i<words.length; i++){
		var vec = toXYCoords(words[i].coordinates);
		words[i].html.style.top = -25 + vec.y + 'px';
		words[i].html.style.left = 5 + vec.x + 'px';

	}

}

function moveToPoint(point) {
	var tween = new TWEEN.Tween(camera.target).to({
    x: point.x,
    y: point.y,
    z: point.z
	}, 1000).easing(TWEEN.Easing.Exponential.Out).onUpdate(function () {
		camera.lookAt(new THREE.Vector3(this.x, this.y, this.z))
		updateText()
	}).onComplete(function () {
    camera.lookAt(point)
		updateText()
	}).start()
}

function animate(time) {
	requestAnimationFrame(animate)
	TWEEN.update(time)
}


//"main function"
setUpScene();
//addPts();
render();
