/* This is essentially the main file,
which handles initializing the 3D world and keeping
track of the objects within it */


// Axes for debugging
var xAxis = xAxis || new THREE.Vector3(1,0,0)
var yAxis = yAxis || new THREE.Vector3(0,1,0)
var zAxis = zAxis || new THREE.Vector3(0,0,1)

// list of selected nodes
var selectedNodes = [];

// Keep track of nodes that are already added
var added = {}

// Keep track of mathematical expression
var math = new THREE.Vector3(0, 0, 0) 	// Actual computed value
var operations = [] 										// List of operations as strings
var lines = [] 													// 3D Vector representation

// Keep track of added words (nodes)
var words = []

// Shortcut for returning a vector3
function v(x,y,z) {
	return new THREE.Vector3(x,y,z)
}

// Initialize ThreeJS objects
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 10000 )
var renderer = new THREE.WebGLRenderer()
var cameraParent = new THREE.Object3D()
var pointGeo, points, mat

// Initialize the 3D world
function setUpScene(){

	// Initialize renderer and add to screen
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.setClearColor(0x000000)
	renderer.clear()
	document.body.appendChild(renderer.domElement)

	// Initialize camera orientation for later repositioning
	camera.position.z = 100;
	camera.lookAt(new THREE.Vector3(0, 0, 0))
	camera.target = new THREE.Vector3(0, 0, 0)

	// Create a 3D scatterplot to hold all nodes
	var scatterPlot = new THREE.Object3D();
	scene.add(scatterPlot);

	// Represent each node as a cube
	mat = new THREE.PointsMaterial(
			{vertexColors: true, size: 1.5})

	// Add scatterplot with points geometry for later updating
	pointGeo = new THREE.Geometry()
	points = new THREE.Points(pointGeo, mat)
	scatterPlot.add(points)

	// Creating and add axes for debugigng
	var axisGeo = new THREE.Geometry();
	axisGeo.vertices.push(
		v(-50, 0, 0), v(50, 0, 0),
	 	v(0, -50, 0), v(0, 50, 0),
		v(0, 0, -50), v(0, 0, 50)
	)
	var axisMat = new THREE.LineBasicMaterial({
		color: 0x000000
	})
	var axes = new THREE.LineSegments(axisGeo, axisMat)
	axes.type = THREE.Lines
	scene.add(axes)

	// Repeatedly request animation frame to allow for transitions
	requestAnimationFrame(animate)

}

// Render 3D world when changed
var render = function () {
	requestAnimationFrame(render)
	renderer.render(scene, camera)
}

// Add a word to the scatterplot
function addWord(word){

	// Ensure that word is in lowercase
	word = word.toLowerCase()

	// Create geometry to store the incoming point
	var newPointGeo = new THREE.Geometry()

	// If the word is not found...
	if (dictionary[word] == null) {
		// Indicate so to the user
		document.getElementById('tip').innerHTML = "oops! that word wasn't found. what about..."
		// Choose a random word from the data set
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
		// Returned value is what is now displayed in the search bar
		return example
	} else {
		document.getElementById('tip').innerHTML = "great! use leap motion to navigate"
	}

	// Turn the dataset matrix into a point for 3D space
	var newPoint = new THREE.Vector3(dictionary[word][0],
	dictionary[word][1],dictionary[word][2]).multiplyScalar(50) // Importantly multiply by 50

	// This must be done beforehand because...
	// If the word is already added...
	if (added[word] != null) {
		// Orient the camera to it in 3D space
		orientCamera(newPoint)
		// Empty the search field on return
		return ""
	}

	// Push the new node to the scatterplot geometry
	newPointGeo.vertices.push(newPoint)

	// Color the node to reflect each of the three dimensions
	newPointGeo.colors.push(new THREE.Color('rgb('
		+ parseInt(Math.abs(dictionary[word][0]) * 255) + ',' 			// x red
		+ parseInt(Math.abs(dictionary[word][1]) * 255) + ',' 			// y green
		+ parseInt(Math.abs(dictionary[word][2]) * 255) + ')'))			// z blue

	// Create and add the actual node
	var points2 = new THREE.Points(newPointGeo, mat)
	points2.name = word;
	scene.add(points2)

	// Create and add a plain HTML label to the screen
	var text2 = document.createElement('div')
	document.body.appendChild(text2)

	// If a previous word has been investigated, de-select it
	for(var i=0; i<selectedNodes.length;i++){
		words[selectedNodes[i]].html.className = 'label'

	}

	// Select the newly added word
	text2.className = 'bright label'

	// Set the label to the newly added word
	text2.innerHTML = word

	// Convert the nodes position in 3D space to 2D space for the label
	var vec = toXYCoords(newPoint)

	// Create a new word object with the schema:
	// {name: word, html: text2, coordinates: newPoint, group: -1};
	var curObj = createWord(word, text2, newPoint, -1)
	words.push(curObj)

	// Set the last investigated word to the newly added word
	selectedNodes.push(words.length - 1);

	// Orient the camera to the newly added word
	orientCamera(newPoint)

	// Position the label at the node
	text2.style.top = vec.y + 'px'
	text2.style.left = vec.x + 'px'

	// Redraw
	render()

	// Store that this word has now been added to the screen
	added[word] = true

	// Empty the search field on return
	return ""

}

// Create a node-word with a consistent schema for better architecture
function createWord(name, htmlText, coordinates, group) {

	return {name: name, html: htmlText, coordinates: coordinates, group: group, edges: []}

}



// Remove a word from the interface
function removeWord(i) {

	// Remove from scene
	var word = words[i].name
	var object = scene.getObjectByName(word)
	scene.remove(object)

	//remove associated edges
	for (var j=0;j<words[i].edges.length; j++){
		var e = scene.getObjectByName(words[i].edges[j]);
		scene.remove(e);
	}

	// Remove from HTML
	words[i].html.parentNode.removeChild(words[i].html)

	// Remove from words list
	words.splice(i, 1)

	// Redraw
	render()
}



// Convert 3D coordinates to 2D coordinates
function toXYCoords (pos) {

	var raycaster = new THREE.Raycaster()
  var vector = new THREE.Vector3()

	// Get copy of target vector so as to not modify original
	vector = pos.clone()

	// Project to vector from camera position
	vector.applyAxisAngle(zAxis, scene.rotation.z)
	vector.applyAxisAngle(yAxis, scene.rotation.y)
	vector.applyAxisAngle(xAxis, scene.rotation.x)
	vector.project(camera)

	// Return vector as 2D coordinates based on screen size
  vector.x = (vector.x + 1)/2 * renderer.getSize().width
  vector.y = -(vector.y - 1)/2 * renderer.getSize().height + 50;
  return vector

}

// Add test points for debugging
function addPts() {

	var newPointGeo = new THREE.Geometry()
	var point
	for (var i = -50; i < 50; i++){
		point = v(i, i, i)
		newPointGeo.vertices.push(point);
		newPointGeo.colors.push(new THREE.Color(0x00ff00))
	}
	var points2 = new THREE.Points(newPointGeo, mat)
	scene.add(points2)

}


// Update the text labels based on updated camera and scene positions
function updateText() {

	// Convert everyone to 2D space from 3D node position
	for (var i=0; i<words.length; i++){
		var vec = toXYCoords(words[i].coordinates)
		words[i].html.style.top = -25 + vec.y + 'px'
		words[i].html.style.left = 5 + vec.x + 'px'
	}

	//redraw() redrawing here destroys performance

}

// Orient camera to a point in 3D space
function orientCamera(point) {

	// Start a tween with TweenJS
	var tween = new TWEEN.Tween(camera.target).to({
		// Interpolate it to the target point
	  x: point.x,
	  y: point.y,
	  z: point.z
	}, 1000)
	// Use calming easing
	.easing(TWEEN.Easing.Exponential.Out)
	// On every frame make sure to update labels as well
	.onUpdate(function () {
		camera.lookAt(new THREE.Vector3(this.x, this.y, this.z))
		updateText()
	})
	// Ensure update on last frame
	.onComplete(function () {
	  camera.lookAt(point)
		updateText()
	})
	// Start actual tween
	.start()

}

// Request animation frame loop
function animate(time) {
	requestAnimationFrame(animate)
	TWEEN.update(time)
}

// The "main" function
setUpScene()
//addPts()
render()
