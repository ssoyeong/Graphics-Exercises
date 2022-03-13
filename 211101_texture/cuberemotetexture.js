var canvas;
var gl;

var numVertices  = 36;

var texSize = 64;

var program;

var pointsArray = [];
var colorsArray = [];
var texCoodsArray = [];

var texture;

var texCoord = [
   vec2(0, 0), 
   vec2(0, 1), 
   vec2(1, 1), 
   vec2(1, 0), 
]

var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 )
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


var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;
var theta = [0, 0, 0];

var ctm;
var ambientColor, diffuseColor, specularColor;
var modelView, projection;
var viewerPos;


var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta =[0, 0, 0];

var modelViewMatrixLoc;


function configureTexture(image){
   texture = gl.createTexture();
   gl.bindTexture(gl.TEXTURE_2D, texture);
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

   gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function quad(a, b, c, d) {

     pointsArray.push(vertices[a]);
     normalsArray.push(vertexColors[a]);
     texCoodsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]);
     normalsArray.push(vertexColors[a]);
     texCoodsArray.push(texCoord[1]);

     pointsArray.push(vertices[c]);
     normalsArray.push(vertexColors[a]);
     texCoodsArray.push(texCoord[2]);


     pointsArray.push(vertices[a]);
     normalsArray.push(vertexColors[a]);
     texCoodsArray.push(texCoord[0]);


     pointsArray.push(vertices[c]);
     normalsArray.push(vertexColors[a]);
     texCoodsArray.push(texCoord[2]);


     pointsArray.push(vertices[d]);
     normalsArray.push(vertexColors[a]);
     texCoodsArray.push(texCoord[3]);
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
   gl.cullFace(gl.FRONT);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoodsArray), gl.STATIC_DRAW );
    
    var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

   var url = "https://cl.staticflickr.com/9/8873/18598400202_3af67ef8f_q.jpg";

   var image = new Image();
   image.onload = function(){
      configureTexture(image);
   }

   image.crossOrigin = "";
   image.src = url;

   

    

    document.getElementById("ButtonX").onclick = function(){axis = xAxis; render();};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis; render();};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis; render();};
    document.getElementById("ButtonT").onclick = function(){flag = !flag; render();};

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition) );

    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"),materialShininess);

    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
       false, flatten(projection));

    render();
}

var render = function(){

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag) theta[axis] += 2.0;

    modelView = mat4();
    modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0] ));
    modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0] ));
    modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1] ));

    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );

    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

}
