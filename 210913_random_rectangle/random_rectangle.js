
var gl;
var points;

window.onload = function init()
{
  var canvas = document.getElementById( "gl-canvas" );
  
  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  //  Configure WebGL
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
  
  //  Load shaders and initialize attribute buffers
  
  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );
  
  // Load the data into the GPU
  
  var bufferId = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );

  // Associate out shader variables with our data buffer
  var vPosition = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray( vPosition );

	// we added a uniform called vResolution. 
	var vResolution = gl.getUniformLocation(program, "vResolution");
	var color = gl.getUniformLocation(program, "color");
	
	// set the resolution
	gl.uniform2f(vResolution, gl.canvas.width, gl.canvas.height);
	// draw 50 random rectangles in random colors
	for (var ii = 0; ii < 50; ++ii) {
		// Setup a random rectangle
		// This will write to positionBuffer because
		// its the last thing we bound on the ARRAY_BUFFER
		// bind point
		setRectangle(
			gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));

		// Set a random color.
		gl.uniform4f(color, Math.random(), Math.random(), Math.random(), 1);

		// Draw the rectangle.
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}
};

// Returns a random integer from 0 to range - 1.
function randomInt(range) {
  return Math.floor(Math.random() * range);
}

// Fills the buffer with the values that define a rectangle.
 
function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
 
  // NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect
  // whatever buffer is bound to the `ARRAY_BUFFER` bind point
  // but so far we only have one buffer. If we had more than one
  // buffer we'd want to bind that buffer to `ARRAY_BUFFER` first.
 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2]), gl.STATIC_DRAW);
}
