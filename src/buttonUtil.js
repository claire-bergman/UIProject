var sentences = [];


//adds a linear sentence
function addSentence(){
	console.log("sentence");
	var curSentence = [];
	for (var i=1; i<selectedNodes.length; i++){
		curSentence.push(addLine(words[selectedNodes[i-1]],words[selectedNodes[i]]));
	}
}







// Helper function to add a line from one node-word to another
function addLine(word1, word2) {

	var axisGeo = new THREE.Geometry()
	axisGeo.vertices.push(
		word1.coordinates, word2.coordinates
	)
	var axisMat = new THREE.LineBasicMaterial({
		color: 0xeeeeee
	})
	var axes = new THREE.LineSegments(axisGeo, axisMat)
	axes.type = THREE.Lines
	scene.add(axes)
	return axes;

}