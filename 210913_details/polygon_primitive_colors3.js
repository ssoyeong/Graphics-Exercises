
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

    //  Configure WebGL    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );    
    gl.clear( gl.COLOR_BUFFER_BIT );

    // Draw the hexagon
    drawHexagonVertices(vPosition, vColor, offset);
    
    // Draw the triangle
    drawTriangleVertices(vPosition, vColor, offset);

    // Draw the independent triangle	
    drawStripVertices(vPosition, vColor, offset);
};

function setBuffer(vertices) {    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );	
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );	
    return bufferId;
}

function drawHexagonVertices(vPosition, vColor, offset) {
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

	gl.vertexAttribPointer( vPosition, itemSize, gl.FLOAT, false, 0, 0 );	
    gl.enableVertexAttribArray( vPosition );
    
	gl.disableVertexAttribArray(vColor);    // We disable the vertex attrib array since we want to use a constant color for all vertices in the hexagon
	gl.vertexAttrib4f(vColor, 0.0, 0.0, 0.0, 1.0);  //specify constant values for generic vertex attributes.

	gl.drawArrays(gl.LINE_LOOP, 0, numberOfItem); 	
}

function drawTriangleVertices(vPosition, vColor, offset) {
    // triangle vertices	
    itemSize = 2;
    colorSize = 4;
    numberOfItem = 3;
    var triangleVertices = new Float32Array([
        0.3, 0.4, 1.0, 0.0, 0.0, 1.0,//v0 
        0.7, 0.4, 0.0, 1.0, 0.0, 1.0,//v1
        0.5, 0.8, 0.0, 0.0, 1.0, 1.0,//v2
    ]);	
    var triangleBufferId =  setBuffer(triangleVertices);

    gl.vertexAttribPointer( vPosition, itemSize, gl.FLOAT, false, 24, 0);		   
    gl.enableVertexAttribArray( vPosition );
    gl.enableVertexAttribArray( vColor );  // For the triangle we want to use per-vertex color so we enable the vertexColorAttribute again		    
	gl.vertexAttribPointer( vColor, colorSize, gl.FLOAT, false, 24, 8 );					    

	gl.drawArrays(gl.TRIANGLES, 0, numberOfItem); 	    
}

function drawStripVertices(vPosition, vColor, offset) {
	// strip vertices		
    itemSize = 2;   
    colorSize = 0; 
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
    var stripBufferId = setBuffer(flatten(stripVertices)) 	 

	gl.vertexAttribPointer( vPosition, itemSize, gl.FLOAT, false, 0, 0 );		
    gl.enableVertexAttribArray( vPosition );

    // draw triangle-strip   	
	gl.disableVertexAttribArray( vColor ); // We disable the vertex attribute array for the vertexColorAttribute and use a constant color again.
	gl.vertexAttrib4f(vColor, 1.0, 1.0, 0.0, 1.0);	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, numberOfItem);	

	// draw triangle-strip-color   	
	gl.vertexAttrib4f(vColor, 0.0, 0.0, 0.0, 1.0);
    gl.drawArrays(gl.LINE_STRIP, 0, numberOfItem);
	
	// draw triangle-strip   	
    gl.uniform4fv(offset,[0,-0.5,0,0]);
    gl.drawArrays(gl.LINE_STRIP, 0, numberOfItem);
}
