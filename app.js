var app = {};

(function() {

    var canvas;
    var ctx;
    var nt;

    var blockMap = [];

    var hunter = {
        x: 10,
        y: 10,
        targetNode: 0,
        route: []
    };

    var blockColour = "#efefef";

    var targetNodeId;
    var pulseSize = 1;
    var pulseDirc = 1;

    var nodeGraph = [];

    var showGraph = true;
    var showNodeGraph = false;

    var start = function() {

        canvas = document.getElementById("canvasMain");
        ctx = canvas.getContext("2d");

        nt = app.NodeTraversalService;

        for (var cp = 0; cp < 250; cp++) {
            var x = Math.floor(Math.random() * 25);
            var y = Math.floor(Math.random() * 25);
            blockMap.push({x: x, y: y});
        }

        drawMap();
        buildNodeGraph();

        targetNodeId = Math.floor((nodeGraph.length / 2) + (Math.random() * (nodeGraph.length / 2)));
    
        nt.nodes = nodeGraph;
        hunter.route = nt.getBestPath(0, targetNodeId);

        console.log("BEST: " + JSON.stringify(hunter.route));

        startHunter();

    };
    app.start = start;

    var toggleRoute = function() {
        showGraph = !showGraph;
    }
    app.toggleRoute = toggleRoute;

    var toggleNodeGraph = function() {
        showNodeGraph = !showNodeGraph;
    }
    app.toggleNodeGraph = toggleNodeGraph;
    

    var toggleMode = function() {
        if (blockColour === "#efefef") {
            blockColour = "#afafaf";
        } else {
            blockColour = "#efefef";
        }
    }
    app.toggleMode = toggleMode;

    function startHunter() {
        setInterval(drawStuff, 10);
        setInterval(moveHunter, 20);
    }

    function moveHunter() {
        var targetNode = nodeGraph[hunter.targetNode];
        if (targetNode.x === hunter.x && targetNode.y === hunter.y) {
            // get next nodeId
            for (var i = hunter.route.length - 1; i > 0; i--) {
                if (hunter.route[i] === hunter.targetNode) {
                    hunter.targetNode = hunter.route[i - 1];
                    targetNode = nodeGraph[hunter.targetNode];
                    break;
                }
            }
        }
        if (hunter.x < targetNode.x) hunter.x = hunter.x + 1;
        if (hunter.x > targetNode.x) hunter.x = hunter.x - 1;
        if (hunter.y < targetNode.y) hunter.y = hunter.y + 1;
        if (hunter.y > targetNode.y) hunter.y = hunter.y - 1;

    }

    function drawStuff() {
        drawMap();

        if (showNodeGraph) drawNodeGraph();
        if (showGraph) drawBestRoute(hunter.route);

        ctx.beginPath();
        ctx.fillStyle = "#aa0000";
        ctx.arc(nodeGraph[targetNodeId].x, nodeGraph[targetNodeId].y, pulseSize, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "#00aa00";
        ctx.arc(hunter.x, hunter.y, 8, 0, 2 * Math.PI, false);
        ctx.fill();

        if (pulseDirc === 1) {
            pulseSize++;
            if (pulseSize > 8) {
                pulseSize = 8;
                pulseDirc = 2;
            }
        } else {
            pulseSize--;
            if (pulseSize < 0) {
                pulseSize = 0;
                pulseDirc = 1;
            }
        }

    }

    function buildNodeGraph() {
        nodeGraph = [];
        for (var y = 0; y < 17; y++) {
            for (var x = 0; x < 24; x++) {
                var px = 10 + (x * 40);
                var py = 10 + (y * 40);
                var dat = ctx.getImageData(px, py, 1, 1).data;
                if (dat[0] === 255) {
                    nodeGraph.push({x: px, y: py});
                }
            }
        }

        for (var i = 0; i < nodeGraph.length; i++) {
            nodeGraph[i].children = [];
            applyConnection(nodeGraph[i].x - 40, nodeGraph[i].y, i);      // WEST
            applyConnection(nodeGraph[i].x, nodeGraph[i].y - 40, i);      // NORTH
            applyConnection(nodeGraph[i].x + 40, nodeGraph[i].y, i);      // EAST
            applyConnection(nodeGraph[i].x, nodeGraph[i].y + 40, i);      // SOUTH
        }

    }

    function applyConnection(x, y, nodeId) {
        var currentNode = nodeGraph[nodeId];
        for (var i = 0; i < nodeGraph.length; i++) {
            var childNode = nodeGraph[i]
            if (childNode.x === x && childNode.y === y && i != nodeId) {
                currentNode.children.push(i);
            }
        }
    }

    function findElementByCoords(x, y) {
        for (var i = 0; i < nodeGraph.length; i++) {
            if (nodeGraph[i].x === x && nodeGraph[i].y === y) {
                return i;
            }
        }
        return -1;
    }

    function drawMap() {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 980, 700);
        for (var y = 0; y < 17; y++) {
            for (var x = 0; x < 24; x++) {
                ctx.fillStyle = blockColour;
                ctx.fillRect(20 + (x * 40), 20 + (y * 40), 20, 20);
            }
        }

        for (var cp = 0; cp < blockMap.length; cp++) {
            ctx.fillStyle = blockColour;
            ctx.fillRect(-5 + (blockMap[cp].x * 40), -5 + (blockMap[cp].y * 40), 30, 30);
        }
    }

    function drawNodeGraph() {
        for (var i = 0; i < nodeGraph.length; i++) {
            ctx.fillStyle = "#ffd0d0";
            ctx.fillRect(nodeGraph[i].x, nodeGraph[i].y, 2, 2);
            for (var a = 0; a < nodeGraph[i].children.length; a++) {
                var childNodeId = nodeGraph[i].children[a];
                ctx.beginPath();
                ctx.strokeStyle = "#d0d0ff";
                ctx.moveTo(nodeGraph[i].x, nodeGraph[i].y);
                ctx.lineTo(nodeGraph[childNodeId].x, nodeGraph[childNodeId].y);
                ctx.stroke();
            }
        }
    }

    function drawBestRoute(route) {
        for (var i = 1; i < route.length; i++) {
            ctx.beginPath();
            ctx.strokeStyle = "#5050ff";
            ctx.moveTo(nodeGraph[route[i - 1]].x, nodeGraph[route[i - 1]].y);
            ctx.lineTo(nodeGraph[route[i]].x, nodeGraph[route[i]].y);
            ctx.stroke();
        }
    }


})();