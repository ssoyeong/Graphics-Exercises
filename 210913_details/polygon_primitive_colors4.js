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

    // Load the hexagon
    var hexagonBufferId = loadHexagonVertices();

    // Load the hexagon
    var triangleVertexBufferId = loadTriangleVertices();
    var triangleColorsBufferId = loadTriangleColors();

    // Load the independent triangle	
    var stripBufferId = loadStripVertices();

    //  Configure WebGL    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );

    // Draw the hexagon
    drawHexagonVertices(hexagonBufferId, vPosition, vColor, offset);

    // Draw the triangle
    drawTriangleVertices(triangleVertexBufferId, triangleColorsBufferId, 
        vPosition, vColor, offset);

    // Draw the independent triangle	
    drawStripVertices(stripBufferId, vPosition, vColor, offset);

};


function setBuffer(vertices) {    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );	
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );	
    return bufferId;
}

function loadHexagonVertices() {
    // hexagon vertices	 
    itemSize = 2;
    numberOfItem = 6;
    var hexagonVertices = [
        vec2(-0.3,  0.6), //v0
        vec2(-0.4,  0.8), //v1
        vec2(-0.6,  0.8), //v2
        vec2(-0.7,  0.6), //v3
        vec2(-0.6,  0.4), //v4
        vec2(-0.4,  0.4), //v5        
    ]; 
    var hexagonBufferId = setBuffer(flatten(hexagonVertices)) 
    hexagonBufferId.itemSize = itemSize;
    hexagonBufferId.numberOfItem = numberOfItem;
    return hexagonBufferId;
}

function loadTriangleVertices() {
    // triangle vertices	
    itemSize = 2;
    numberOfItem = 3;
    var triangleVertices = [
        vec2(0.3, 0.4),//v0 
        vec2(0.7, 0.4),//v1
        vec2(0.5, 0.8),//v2
    ];	
    var triangleVertexBufferId =  setBuffer(flatten(triangleVertices));
    triangleVertexBufferId.itemSize = itemSize;
    triangleVertexBufferId.numberOfItem = numberOfItem;
    return triangleVertexBufferId;
}

function loadTriangleColors() {
    // triangle colors	
    colorSize = 4;
    numberOfItem = 3;
    var triangleColors = [
        vec4(1.0, 0.0, 0.0, 1.0),//v0 
        vec4(0.0, 1.0, 0.0, 1.0),//v1
        vec4(0.0, 0.0, 1.0, 1.0),//v2
    ];	
    var triangleColorsBufferId =  setBuffer(flatten(triangleColors));    
    triangleColorsBufferId.colorSize = colorSize;
    triangleColorsBufferId.numberOfItem = numberOfItem;
    return triangleColorsBufferId;
}

function loadStripVertices() {    
    // strip vertices		
    itemSize = 2;   
    numberOfItem = 11;   
    var stripVertices = [
        vec2(-0.5,  0.2), //v0
        vec2(-0.4,  0.0), //v1
        vec2(-0.3,  0.2), //v2
        vec2(-0.2,  0.0), //v3
        vec2(-0.1,  0.2), //v4
        vec2(0.0,  0.0), //v5
        vec2(0.1,  0.2), //v6
        vec2(0.2,  0.0), //v7
        vec2(0.3,  0.2), //v8
        vec2(0.4,  0.0), //v9
        vec2(0.5,  0.2), //v10
    ]; 
    var stripBufferId = setBuffer(flatten(stripVertices));

    stripBufferId.itemSize = itemSize;
    stripBufferId.numberOfItem = numberOfItem;
    
    return stripBufferId;
}

function drawHexagonVertices(hexagonBufferId, vPosition, vColor, offset) {
    gl.bindBuffer( gl.ARRAY_BUFFER, hexagonBufferId);	
	gl.vertexAttribPointer( vPosition, hexagonBufferId.itemSize, gl.FLOAT, false, 0, 0 );	
    gl.enableVertexAttribArray( vPosition );
    
	gl.disableVertexAttribArray(vColor);    // We disable the vertex attrib array since we want to use a constant color for all vertices in the hexagon
	gl.vertexAttrib4f(vColor, 0.0, 0.0, 0.0, 1.0);  //specify constant values for generic vertex attributes.

	gl.drawArrays(gl.LINE_LOOP, 0, hexagonBufferId.numberOfItem); 	
}

function drawTriangleVertices(triangleBufferId, triangleColorsBufferId, 
    vPosition, vColor, offset) {
    gl.bindBuffer( gl.ARRAY_BUFFER, triangleBufferId);
    gl.vertexAttribPointer( vPosition, triangleBufferId.itemSize, gl.FLOAT, false, 0, 0);		   
    gl.enableVertexAttribArray( vPosition );

    gl.bindBuffer( gl.ARRAY_BUFFER, triangleColorsBufferId);
    gl.enableVertexAttribArray( vColor );  // For the triangle we want to use per-vertex color so we enable the vertexColorAttribute again		    
	gl.vertexAttribPointer( vColor, triangleColorsBufferId.colorSize, gl.FLOAT, false, 0, 0);					    
    
	gl.drawArrays(gl.TRIANGLES, 0, triangleBufferId.numberOfItem); 	    
}

function drawStripVertices(stripBufferId, vPosition, vColor, offset) {
    gl.bindBuffer( gl.ARRAY_BUFFER, stripBufferId);
	gl.vertexAttribPointer( vPosition, stripBufferId.itemSize, gl.FLOAT, false, 0, 0 );		
    gl.enableVertexAttribArray( vPosition );

    // draw triangle-strip   	
	gl.disableVertexAttribArray( vColor ); // We disable the vertex attribute array for the vertexColorAttribute and use a constant color again.
	gl.vertexAttrib4f(vColor, 1.0, 1.0, 0.0, 1.0);	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, stripBufferId.numberOfItem);	

	// draw triangle-strip-color   	
	gl.vertexAttrib4f(vColor, 0.0, 0.0, 0.0, 1.0);
    gl.drawArrays(gl.LINE_STRIP, 0, stripBufferId.numberOfItem);
	
	// draw triangle-strip   	
    gl.uniform4fv(offset,[0,-0.5,0,0]);
    gl.drawArrays(gl.LINE_STRIP, 0, stripBufferId.numberOfItem);
}