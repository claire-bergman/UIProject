var sentences = [];


//adds a linear sentence based on order items were added
function addSentence(){
	var curColor = new THREE.Color('rgb('
		+ Math.round(Math.random()*255) + ',' 			
		+ Math.round(Math.random()*255) + ',' 			
		+ Math.round(Math.random()*255) + ')');	

	console.log("sentence");
	var curSentence = [];
	for (var i=1; i<selectedNodes.length; i++){
		curSentence.push(addLine(words[selectedNodes[i-1]],words[selectedNodes[i]], curColor));
	}
}







// Helper function to add a line from one node-word to another
function addLine(word1, word2, color) {

	var axisGeo = new THREE.Geometry()
	axisGeo.vertices.push(
		word1.coordinates, word2.coordinates
	)
	var axisMat = new THREE.LineBasicMaterial({
		color: color
	})
	var axes = new THREE.LineSegments(axisGeo, axisMat)
	axes.type = THREE.Lines
	scene.add(axes)
	return axes;

}