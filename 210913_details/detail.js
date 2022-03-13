var gl;
var points;

window.onload = function init()
{
var canvas = document.getElementById( "gl-canvas" );

gl = WebGLUtils.setupWebGL( canvas );
if ( !gl ) { alert( "WebGL isn't available" ); }

//	Load shaders
var program = initShaders( gl, "vertex-shader", "fragment-  shader" );
gl.useProgram( program );

var vPosition = gl.getAttribLocation(program, "vPosition");  
var vColor = gl.getAttribLocation(program, "vColor");
var offset = gl.getUniformLocation(program, "offset");

//	Configure WebGL
gl.viewport( 0, 0, canvas.width, canvas.height );
gl.clearColor( 1.0, 1.0, 1.0, 1.0 );  
gl.clear( gl.COLOR_BUFFER_BIT );

// Draw the hexagon  
drawHexagonVertices(vPosition, vColor, offset);

// Draw the triangle  drawTriangleVertices
// (vPosition, vColor, offset);

// Draw the independent triangle  drawStripVertices
// (vPosition, vColor, offset);

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
    vec2(-0.3,	0.6), //v0
    vec2(-0.4,	0.8), //v1
    vec2(-0.6,	0.8), //v2
    vec2(-0.7,	0.6), //v3
    vec2(-0.6,	0.4), //v4
    vec2(-0.4,	0.4), //v5
    ];
    var hexagonBufferId = setBuffer(flatten(hexagonVertices))
    
    gl.vertexAttribPointer( vPosition, itemSize, gl.FLOAT, false, 0,  0 );
    gl.enableVertexAttribArray( vPosition );

    gl.disableVertexAttribArray(vColor);	// We disable the vertex  attrib array since we want to use a constant color for all vertices i  n the hexagon
    gl.vertexAttrib4f(vColor, 0.0, 0.0, 0.0, 1.0);	//specify constan  t values for generic vertex attributes.

    gl.drawArrays(gl.LINE_LOOP, 0, numberOfItem);
}




