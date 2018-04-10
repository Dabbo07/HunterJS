(function() {

    var NodeTraversalService = function() {
    };

    /*
        Expected NODE format
        {
            x: 0,
            y: 0,
            children: [ 0, 1, 2, ... ]
        }
    */

    NodeTraversalService.prototype.nodes = [];

    NodeTraversalService.prototype.distanceCalc = function(sx, sy, ex, ey) {
        var deltaX = sx - ex;
        var deltaY = sy - ey;
        return Math.sqrt(Math.pow(deltaY, 2) + Math.pow(deltaX, 2));
    };
    
    NodeTraversalService.prototype.getBestPath = function(startNode, endNode) {
        
        console.log("Started path.");

        // Initialise Metadata on Existing Node Graph
        for (var i = 0; i < this.nodes.length; i++) {
            var selNode = this.nodes[i];
            selNode.traverse = {};
            selNode.traverse.currentWeight = -1;
            selNode.traverse.previousNode = -1;
            selNode.traverse.visited = false;
        }
        // Initialise start node
        this.nodes[startNode].traverse.currentWeight = 0;

        var processTraversal = true;
        while (processTraversal) {

            var selNodeId = -1;
            var lowestDist = -1;
            // Find lowest weight node that hasn't been visited yet.
            for (var i = 0; i < this.nodes.length; i++) {
                var selNode = this.nodes[i];
                if (!selNode.traverse.visited) {
                    if (selNode.traverse.currentWeight != -1 && (lowestDist === -1 || selNode.traverse.currentWeight < lowestDist)) {
                        selNodeId = i;
                        lowestDist = selNode.traverse.currentWeight;
                    }
                }
            }
            // No nodes found, finished?
            if (selNodeId === -1) {
                processTraversal = false;
            } else {
                var parentNode = this.nodes[selNodeId];
                parentNode.traverse.visited = true;
                
                // Process unvisited children
                for (var i = 0; i < parentNode.children.length; i++) {
                    var childId = parentNode.children[i];
                    var childNode = this.nodes[childId];
                    if (!childNode.traverse.visited) {
                        var calcDist = this.distanceCalc(parentNode.x, parentNode.y, childNode.x, childNode.y);
                        var totalWeight = parentNode.traverse.currentWeight + calcDist;
                        if (childNode.traverse.currentWeight === -1 || totalWeight < childNode.traverse.currentWeight) {
                            childNode.traverse.currentWeight = totalWeight;
                            childNode.traverse.previousNode = selNodeId;
                        }
                    }
                }
            }
        }

        // Starting from endNode, traverse path back to startNode (if possible).
        var shortestPath = new Array();
        var processScan = true;
        var currentNodeId = endNode;
        while (processScan) {
            if (currentNodeId === -1) {
                processScan = false;
            } else {
                shortestPath.push(currentNodeId);
                if (currentNodeId === startNode || currentNodeId === -1) {
                    processScan = false;
                }
                currentNodeId = this.nodes[currentNodeId].traverse.previousNode;
            }
        }

        console.log("Completed path.");

        return shortestPath;
    };
    
    app.NodeTraversalService = new NodeTraversalService();

})();

