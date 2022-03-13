var canvas;
var gl;

var numVertices = 84;

var pointsArray = [];
var colorsArray = [];


var radius = 1.0;
var theta = 0.0;
var phi = 0.0;
var dr = 5.0* Math.PI/180.0;

var mvMatrix;
var modelView;
var eye;

const at = vec3(0.0,0.0,0.0);
const up = vec3(0.0,1.0,0.0);

function quad(a, b, c, d){

    var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ), // 0
        vec4( -0.5,  0.5,  0.5, 1.0 ), // 1
        vec4(  0.5,  0.5,  0.5, 1.0 ), // 2
        vec4(  0.5, -0.5,  0.5, 1.0 ), // 3
        vec4( -0.5, -0.5, -0.5, 1.0 ), // 4 
        vec4( -0.5,  0.5, -0.5, 1.0 ), // 5
        vec4(  0.5,  0.5, -0.5, 1.0 ), // 6
        vec4(  0.5, -0.5, -0.5, 1.0 ),  // 7

		// bottom
        vec4( -0.5, -0.5-1.0,  0.5, 1.0 ), // 0
        vec4( -0.5,  0.5-1.0,  0.5, 1.0 ), // 1
        vec4(  0.5,  0.5-1.0,  0.5, 1.0 ), // 2
        vec4(  0.5, -0.5-1.0,  0.5, 1.0 ), // 3
        vec4( -0.5, -0.5-1.0, -0.5, 1.0 ), // 4 
        vec4( -0.5,  0.5-1.0, -0.5, 1.0 ), // 5
        vec4(  0.5,  0.5-1.0, -0.5, 1.0 ), // 6
        vec4(  0.5, -0.5-1.0, -0.5, 1.0 ),  // 7

		// right
        vec4( -0.5+1.0, -0.5,  0.5, 1.0 ), // 0
        vec4( -0.5+1.0,  0.5,  0.5, 1.0 ), // 1
        vec4(  0.5+1.0,  0.5,  0.5, 1.0 ), // 2
        vec4(  0.5+1.0, -0.5,  0.5, 1.0 ), // 3
        vec4( -0.5+1.0, -0.5, -0.5, 1.0 ), // 4 
        vec4( -0.5+1.0,  0.5, -0.5, 1.0 ), // 5
        vec4(  0.5+1.0,  0.5, -0.5, 1.0 ), // 6
        vec4(  0.5+1.0, -0.5, -0.5, 1.0 )  // 7
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    
    var indices = [ a, b, c, a, c, d ]; // 1 0 3, 1 3 2 // 4 5 6, 4 6 7

	console.log(indices)

    for ( var i = 0; i < indices.length; ++i ) {
        pointsArray.push( vertices[indices[i]] );
            
        // for solid colored faces use 
        colorsArray.push(vertexColors[a % 8]);
        
    }
}

function colorCube(){

    quad( 1, 0, 3, 2 ); // blue ( +z ), frontal
//    quad( 2, 3, 7, 6 ); // yellow ( +x ), right
//    quad( 3, 0, 4, 7 ); // green ( -y ), bottom
    quad( 6, 5, 1, 2 ); // cyan ( +y ), top
    quad( 4, 5, 6, 7 ); // red ( -z ), back     
    quad( 5, 4, 0, 1 ); // magenta ( -x ) left


	// bottom
	quad( 8+1, 8+0, 8+3, 8+2 ); // blue ( +z ), frontal
    quad( 8+2, 8+3, 8+7, 8+6 ); // yellow ( +x ), right
    quad( 8+3, 8+0, 8+4, 8+7 ); // green ( -y ), bottom
//    quad( 8+6, 8+5, 8+1, 8+2 ); // cyan ( +y ), top
    quad( 8+4, 8+5, 8+6, 8+7 ); // red ( -z ), back     
    quad( 8+5, 8+4, 8+0, 8+1 ); // magenta ( -x ) left


    quad( 16+1, 16+0, 16+3, 16+2 ); // blue ( +z ), frontal
    quad( 16+2, 16+3, 16+7, 16+6 ); // yellow ( +x ), right
    quad( 16+3, 16+0, 16+4, 16+7 ); // green ( -y ), bottom
    quad( 16+6, 16+5, 16+1, 16+2 ); // cyan ( +y ), top
    quad( 16+4, 16+5, 16+6, 16+7 ); // red ( -z ), back     
//    quad( 16+5, 16+4, 16+0, 16+1 ); // magenta ( -x ) left
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelView = gl.getUniformLocation(program, "modelView"); 
    
    
    document.getElementById('button1').onclick = function () {
        radius *= 1.1;
    };
    document.getElementById('button2').onclick = function () {
        radius *= 0.9;
    };
    document.getElementById('button3').onclick = function () {
        theta += dr;
    };
    document.getElementById('button4').onclick = function () {
        theta -= dr;
    };
    document.getElementById('button5').onclick = function () {
        phi += dr;
    };
    document.getElementById('button6').onclick = function () {
        phi -=dr;
    };
        
    render();
}

var render = function()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.cos(theta)*Math.sin(phi), radius*Math.sin(theta), radius*Math.cos(theta)*Math.cos(phi));
    mvMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
    
    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
    
    requestAnimFrame(render);
    
}