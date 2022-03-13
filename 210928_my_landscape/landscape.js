
var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    //  Load shaders
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    var vColor = gl.getAttribLocation(program, "vColor");
    var offset = gl.getUniformLocation(program, "offset");


    // Load the vertices and colors
    var windowBufferId = loadWindowVertices();
    var skyTopBufferId = loadSkyTopVertices();
    var skyTopColorsBufferId = loadSkyTopColors();
    var skyBottomBufferId = loadSkyBottomVertices();
    var skyBottomColorsBufferId = loadSkyBottomColors();
    var moonBufferId = loadMoonVertices();
    var buildingBufferId = loadBuildingVertices();
    var starBufferId = loadStarVertices();
    var treeBufferId = loadTreeVertices();


    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear( gl.COLOR_BUFFER_BIT );
    
    
    // Draw the window
    drawWindowVertices(windowBufferId, vPosition, vColor, offset);

    // Draw the sky
    drawSkyTopVertices(skyTopBufferId, skyTopColorsBufferId, vPosition, vColor, offset);
    drawSkyBottomVertices(skyBottomBufferId, skyBottomColorsBufferId, vPosition, vColor, offset);

    // Draw the moon
    drawMoonVertices(moonBufferId, vPosition, vColor, offset);

    // Draw the buildings
    drawBuildingVertices(buildingBufferId, vPosition, vColor, offset);

    // Draw the stars
    drawStarVertices(starBufferId, vPosition, vColor, offset);
    
    // Draw the tree
    drawTreeVertices(treeBufferId, vPosition, vColor, offset);

};

function setBuffer(vertices){
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    return bufferId;
}

function loadWindowVertices(){

    // window vertices
    itemSize = 2;
    numberOfItem = 16;
	var windowVertices = [

        vec2(1,   1),           //v0
        vec2(1,  -1),           //v1
        vec2(-1,  1),           //v2
        vec2(-1, -1),           //v3
        
        vec2(-0.88,  1),        //v4
        vec2(0.88,  1),         //v5
        vec2(-0.88,  -0.88),    //v6
        vec2(0.88,  -0.88),     //v7

        vec2(-0.68,  1),        //v8
        vec2(0.68,  1),         //v9
        vec2(-0.68,  -0.64),    //v10
        vec2(0.68,  -0.64),     //v11

        vec2(-0.9,  -0.9),      //v12
        vec2(-0.68,  -0.64),    //v13

        vec2(0.9,  -0.9),       //v14
        vec2(0.68,  -0.64),     //v15
    ]; 
    var windowBufferId = setBuffer(flatten(windowVertices))
    windowBufferId.itemSize = itemSize;
    windowBufferId.numberOfItem = numberOfItem;
    return windowBufferId;
}

function loadSkyTopVertices(){

    // skyTop vertices
    itemSize = 2;
    numberOfItem = 4;
	var skyTopVertices = [

        vec2(-0.6,  1),     //v0
        vec2(0.6,  1),      //v1
        vec2(-0.6,  0.4),   //v2
        vec2(0.6,  0.4),    //v3
    ]; 
    var skyTopBufferId = setBuffer(flatten(skyTopVertices))
    skyTopBufferId.itemSize = itemSize;
    skyTopBufferId.numberOfItem = numberOfItem;
    return skyTopBufferId;
}

function loadSkyTopColors(){

    // skyTop colors
    colorSize = 4;
    numberOfItem = 4;
    var skyTopColors = [

        vec4(0.62, 0.39, 0.76, 1.0),  //v0
        vec4(0.62, 0.39, 0.76, 1.0),  //v1
        vec4(0.4, 0.28, 0.68, 1.0),   //v2
        vec4(0.4, 0.28, 0.68, 1.0),   //v3
    ];
    var skyTopColorsBufferId = setBuffer(flatten(skyTopColors));
    skyTopColorsBufferId.colorSize = colorSize;
    skyTopColorsBufferId.numberOfItem = numberOfItem;
    return skyTopColorsBufferId; 
}

function loadSkyBottomVertices(){

    // skyBottom vertices
    itemSize = 2;
    numberOfItem = 4;
	var skyBottomVertices = [

        vec2(-0.6,  0.32),  //v0
        vec2(0.6,  0.32),   //v1
        vec2(-0.6,  -0.57), //v2
        vec2(0.6,  -0.57),  //v3
    ]; 
    var skyBottomBufferId = setBuffer(flatten(skyBottomVertices))
    skyBottomBufferId.itemSize = itemSize;
    skyBottomBufferId.numberOfItem = numberOfItem;
    return skyBottomBufferId;
}

function loadSkyBottomColors(){

    // skyBottom colors
    colorSize = 4;
    numberOfItem = 4;
    var skyBottomColors = [

        vec4(0.4, 0.28, 0.68, 1.0),  //v0
        vec4(0.4, 0.28, 0.68, 1.0),  //v1
        vec4(0.2, 0.18, 0.65, 1.0),  //v2
        vec4(0.2, 0.18, 0.65, 1.0),  //v3
    ];
    var skyBottomColorsBufferId = setBuffer(flatten(skyBottomColors));
    skyBottomColorsBufferId.colorSize = colorSize;
    skyBottomColorsBufferId.numberOfItem = numberOfItem;
    return skyBottomColorsBufferId; 
}

function loadMoonVertices(){

    // moon vertices
    itemSize = 2;
    numberOfItem = 8;
	var moonVertices = [

        vec2(-0.4,  0.9),   //v0
        vec2(-0.3,  0.9),   //v1
        vec2(-0.22,  0.83), //v2
        vec2(-0.22,  0.73), //v3
        vec2(-0.3,  0.66),  //v4
        vec2(-0.4,  0.66),  //v5
        vec2(-0.48,  0.73), //v6
        vec2(-0.48,  0.83), //v7
    ]; 
    var moonBufferId = setBuffer(flatten(moonVertices))
    moonBufferId.itemSize = itemSize;
    moonBufferId.numberOfItem = numberOfItem;
    return moonBufferId;
}

function loadBuildingVertices(){

    // building vertices
    itemSize = 2;
    numberOfItem = 16;
	var buildingVertices = [

        // first building
        vec2(0.2, 0.32),    //v0
        vec2(0.5, 0.32),    //v1
        vec2(0.2, -0.57),   //v2
        vec2(0.5, -0.57),   //v3

        vec2(0.2, 0.6),     //v4
        vec2(0.5, 0.6),     //v5
        vec2(0.2, 0.4),     //v6
        vec2(0.5, 0.4),     //v7
        

        // second building
        vec2(0.4,  0.1),    //v8
        vec2(0.6,  0.1),    //v9
        vec2(0.4,  -0.57),  //v10
        vec2(0.6,  -0.57),  //v11
       
        // third building
        vec2(0.05, -0.2),   //v12
        vec2(0.5, -0.2),    //v13
        vec2(0.05, -0.57),  //v14
        vec2(0.5, -0.57),   //v15
    ]; 
    var buildingBufferId = setBuffer(flatten(buildingVertices))
    buildingBufferId.itemSize = itemSize;
    buildingBufferId.numberOfItem = numberOfItem;
    return buildingBufferId;
}

function loadStarVertices(){

    // star vertices
    itemSize = 2;
    numberOfItem = 8;
	var starVertices = [
        
        vec2(0.2, 0.9),     //v0
        vec2(0.22, 0.86),   //v1
        vec2(0.26, 0.84),   //v2
        vec2(0.22, 0.82),   //v3
        vec2(0.2, 0.78),    //v4
        vec2(0.18, 0.82),   //v5
        vec2(0.14, 0.84),   //v6
        vec2(0.18, 0.86),   //v7
    ]; 
    var starBufferId = setBuffer(flatten(starVertices))
    starBufferId.itemSize = itemSize;
    starBufferId.numberOfItem = numberOfItem;
    return starBufferId;
}

function loadTreeVertices(){

    // tree vertices
    itemSize = 2;
    numberOfItem = 10;
	var treeVertices = [
        
        // leaf
        vec2(-0.4, 0.2),     //v0
        vec2(-0.3, 0.0),     //v1
        vec2(-0.5, 0.0),     //v2

        // body
        vec2(-0.44, -0.4),   //v4
        vec2(-0.36, -0.4),   //v5
        vec2(-0.44, -0.57),  //v6
        vec2(-0.36, -0.4),   //v7
        vec2(-0.44, -0.57),  //v8
        vec2(-0.36, -0.57),  //v9

    ]; 
    var treeBufferId = setBuffer(flatten(treeVertices))
    treeBufferId.itemSize = itemSize;
    treeBufferId.numberOfItem = numberOfItem;
    return treeBufferId;
}

function drawWindowVertices(windowBufferId, vPosition, vColor, offset){
   
    gl.bindBuffer( gl.ARRAY_BUFFER, windowBufferId);
    gl.vertexAttribPointer(vPosition, windowBufferId.itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    gl.disableVertexAttribArray(vColor);

    gl.vertexAttrib4f(vColor, 0.47, 0.46, 0.65, 1); 
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.vertexAttrib4f(vColor, 0.61, 0.59, 0.85, 1); 
    gl.drawArrays(gl.TRIANGLE_STRIP, 4, 4);

    gl.vertexAttrib4f(vColor, 0.77, 0.76, 0.85, 1); 
    gl.drawArrays(gl.TRIANGLE_STRIP, 8, 4);

    gl.vertexAttrib4f(vColor, 0.47, 0.46, 0.65, 1); 
    gl.drawArrays(gl.LINE_STRIP, 12, 2);
    gl.drawArrays(gl.LINE_STRIP, 14, 2);
}

function drawSkyTopVertices(skyTopBufferId, skyTopColorsBufferId, vPosition, vColor, offset){

    gl.bindBuffer( gl.ARRAY_BUFFER, skyTopBufferId);
    gl.vertexAttribPointer(vPosition, skyTopBufferId.itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer( gl.ARRAY_BUFFER, skyTopColorsBufferId);
    gl.enableVertexAttribArray(vColor);
    gl.vertexAttribPointer( vColor, skyTopColorsBufferId.colorSize, gl.FLOAT, false, 0, 0);			
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, skyTopColorsBufferId.numberOfItem);
}

function drawSkyBottomVertices(skyBottomBufferId, skyBottomColorsBufferId, vPosition, vColor, offset){

    gl.bindBuffer( gl.ARRAY_BUFFER, skyBottomBufferId);
    gl.vertexAttribPointer(vPosition, skyBottomBufferId.itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer( gl.ARRAY_BUFFER, skyBottomColorsBufferId);
    gl.enableVertexAttribArray(vColor);
    gl.vertexAttribPointer( vColor, skyBottomColorsBufferId.colorSize, gl.FLOAT, false, 0, 0);			
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, skyBottomColorsBufferId.numberOfItem);
}

function drawMoonVertices(moonBufferId, vPosition, vColor, offset){

    gl.bindBuffer( gl.ARRAY_BUFFER, moonBufferId);
    gl.vertexAttribPointer(vPosition, moonBufferId.itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    gl.disableVertexAttribArray(vColor);

    gl.vertexAttrib4f(vColor, 0.98, 1.0, 1.0, 1.0);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 8);
}

function drawBuildingVertices(buildingBufferId, vPosition, vColor, offset){

    gl.bindBuffer( gl.ARRAY_BUFFER, buildingBufferId);
    gl.vertexAttribPointer(vPosition, buildingBufferId.itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    gl.disableVertexAttribArray(vColor);

    gl.vertexAttrib4f(vColor, 0.95, 0.55, 0.71, 1); 
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.vertexAttrib4f(vColor, 0.95, 0.55, 0.71, 1); 
    gl.drawArrays(gl.TRIANGLE_STRIP, 4, 4);

    gl.vertexAttrib4f(vColor, 0.9, 0.25, 0.41, 1); 
    gl.drawArrays(gl.TRIANGLE_STRIP, 8, 4);

    gl.vertexAttrib4f(vColor, 0.9, 0.4, 0.51, 1); 
	gl.drawArrays(gl.TRIANGLE_STRIP, 12, 4);
}

function drawStarVertices(starBufferId, vPosition, vColor, offset){

    gl.bindBuffer( gl.ARRAY_BUFFER, starBufferId);
    gl.vertexAttribPointer(vPosition, starBufferId.itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    gl.disableVertexAttribArray(vColor); 

    gl.vertexAttrib4f(vColor, 0.98, 1.0, 1.0, 1.0);  
    gl.drawArrays( gl.LINE_LOOP, 0, starBufferId.numberOfItem);

	gl.uniform4fv(offset,[-0.3, -0.3, 0, 0]); 
    gl.drawArrays( gl.LINE_LOOP, 0, starBufferId.numberOfItem);

	gl.uniform4fv(offset,[-0.65, -0.28, 0, 0]); 
    gl.drawArrays( gl.LINE_LOOP, 0, starBufferId.numberOfItem);

    gl.uniform4fv(offset,[-0.15, -0.65, 0, 0]); 
	gl.drawArrays( gl.LINE_LOOP, 0, starBufferId.numberOfItem);

    gl.uniform4fv(offset,[0.2, -0.15, 0, 0]); 
	gl.drawArrays( gl.LINE_LOOP, 0, starBufferId.numberOfItem);

    gl.uniform4fv(offset,[0, 0, 0, 0]); 
    gl.drawArrays( gl.LINE_LOOP, 0, starBufferId.numberOfItem);

}

function drawTreeVertices(treeBufferId, vPosition, vColor, offset){

    gl.bindBuffer( gl.ARRAY_BUFFER, treeBufferId);
    gl.vertexAttribPointer(vPosition, treeBufferId.itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    gl.disableVertexAttribArray(vColor);
    
    // leaf
    gl.vertexAttrib4f(vColor, 1.0, 1.0, 0.8, 1.0); 
    gl.drawArrays( gl.TRIANGLES, 0, 3 );

    gl.uniform4fv(offset,[0, -0.2, 0, 0]); 
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
    
    gl.uniform4fv(offset,[0, -0.4, 0, 0]); 
    gl.drawArrays( gl.TRIANGLES, 0, 3 );

    gl.uniform4fv(offset,[0.24, -0.2, 0, 0]); 
    gl.drawArrays( gl.TRIANGLES, 0, 3 );

    gl.uniform4fv(offset,[0.24, -0.4, 0, 0]); 
    gl.drawArrays( gl.TRIANGLES, 0, 3 );

    gl.uniform4fv(offset,[0, 0, 0, 0]); 
    gl.drawArrays( gl.TRIANGLES, 0, 3 );

    // body
    gl.vertexAttrib4f(vColor, 1.0, 1.0, 0.6, 1.0);
    gl.drawArrays( gl.TRIANGLES, 3, 6 );

    gl.uniform4fv(offset,[0.24,0,0,0]);
    gl.drawArrays( gl.TRIANGLES, 3, 6 );
}