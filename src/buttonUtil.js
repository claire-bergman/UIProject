var sentences = [];


//adds a linear sentence based on order items were added
function addSentence(){
	var curColor = new THREE.Color('rgb('
		+ Math.round(100+Math.random()*155) + ',' 			
		+ Math.round(100+Math.random()*155) + ',' 			
		+ Math.round(100+Math.random()*155) + ')');	

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
	axes.name = word1.name + "-" + word2.name;
	scene.add(axes)
	word1.edges.push(axes.name);
	word2.edges.push(axes.name);
	return axes;

}