var canvas;
var gl;

var program;
var program_moon;
var program_curtain;

var theta = 0.0;
var thetaLoc;
var direction = true;

var maxNumTriangles = 200;
var maxNumVertices = 3 * maxNumTriangles;
var index = 0;
var t1, t2, t3;

var open = 5.0;


window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    // Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    program_moon = initShaders(gl, "vertex-shader", "fragment-shader");
    program_curtain = initShaders(gl, "vertex-shader", "fragment-shader");

    vColor = gl.getAttribLocation(program, "vColor");
    offset = gl.getUniformLocation(program, "offset");
    translationLocation_moon = gl.getUniformLocation(program_moon, "uTranslation");
    translationLocation_curtain = gl.getUniformLocation(program_curtain, "uTranslation");

    // Button for changing rotation direction of the moon
    document.getElementById('Direction').onclick = function () {

        direction = !direction;
    };

    // Sliders for opening curtain
    document.getElementById("Slider").onchange = function(event) {
        open = event.target.value;
    };

    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);


    //
    // Stars
    //

    // Load the data into the GPU
    star_bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, star_bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    star_vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(star_vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(star_vPosition);

    // MouseEvent for drawing stars
    canvas.addEventListener("mousedown", function (event) {

        gl.bindBuffer(gl.ARRAY_BUFFER, star_bufferId);

        var x = 2 * event.clientX / canvas.width - 1;
        var y = 2 * (canvas.height - event.clientY) / canvas.height - 1;

        // Star vertices
        t1 = vec2([x, y]);
        t2 = vec2([x + 0.02, y - 0.04]);
        t3 = vec2([x + 0.06, y - 0.06]);
        t4 = vec2([x + 0.02, y - 0.08]);
        t5 = vec2([x, y - 0.12]);
        t6 = vec2([x - 0.02, y - 0.08]);
        t7 = vec2([x - 0.06, y - 0.06]);
        t8 = vec2([x - 0.02, y - 0.04]);

        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t1));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 1), flatten(t2));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 2), flatten(t3));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 3), flatten(t4));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 4), flatten(t5));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 5), flatten(t6));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 6), flatten(t7));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 7), flatten(t8));

        index += 8;
    });



    //
    // Rotating moon
    //

    // Moon vertices
    var moon_vertices = [
        vec2(-0.1, 0.1),    //v0
        vec2(0.0, 0.1),     //v1
        vec2(0.05, 0.05),   //v2
        vec2(0.05, -0.05),   //v3
        vec2(0.0, -0.1),    //v4
        vec2(-0.1, -0.1),   //v5
        vec2(-0.15, -0.05), //v6
        vec2(-0.15, 0.05),  //v7
    ];

    // Load the data into the GPU
    moon_bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, moon_bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(moon_vertices), gl.STATIC_DRAW);
    // Associate out shader variables with our data buffer
    moon_vPosition = gl.getAttribLocation(program_moon, "vPosition");



    //
    // Windsows
    //

    // Window vertices
    var window_vertices = [
        vec2(1, 1),           //v0
        vec2(1, -1),           //v1
        vec2(-1, 1),           //v2
        vec2(-1, -1),           //v3

        vec2(-0.88, 1),        //v4
        vec2(0.88, 1),         //v5
        vec2(-0.88, -0.88),    //v6
        vec2(0.88, -0.88),     //v7

        vec2(-0.68, 1),        //v8
        vec2(0.68, 1),         //v9
        vec2(-0.68, -0.64),    //v10
        vec2(0.68, -0.64),     //v11

        vec2(-0.9, -0.9),      //v12
        vec2(-0.68, -0.64),    //v13

        vec2(0.9, -0.9),       //v14
        vec2(0.68, -0.64),     //v15
    ];

    // Load the data into the GPU
    window_bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, window_bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(window_vertices), gl.STATIC_DRAW);
    // Associate out shader variables with our data buffer
    window_vPosition = gl.getAttribLocation(program, "vPosition");



    //
    // Buildings
    //

    // Building vertices
    var building_vertices = [

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
        vec2(0.4, 0.1),    //v8
        vec2(0.6, 0.1),    //v9
        vec2(0.4, -0.57),  //v10
        vec2(0.6, -0.57),  //v11

        // third building
        vec2(0.05, -0.2),   //v12
        vec2(0.5, -0.2),    //v13
        vec2(0.05, -0.57),  //v14
        vec2(0.5, -0.57),   //v15

        // windows of each building
        vec2(0.25, 0.55),
        vec2(0.45, 0.55),
        vec2(0.45, 0.45),
        vec2(0.25, 0.45),

        vec2(0.25, 0.25),
        vec2(0.45, 0.25),
        vec2(0.45, 0.15),
        vec2(0.25, 0.15),

        vec2(0.1, -0.27),
        vec2(0.25, -0.27),
        vec2(0.25, -0.37),
        vec2(0.1, -0.37),

        vec2(0.3, -0.27),
        vec2(0.45, -0.27),
        vec2(0.45, -0.37),
        vec2(0.3, -0.37),

        vec2(0.1, -0.42),
        vec2(0.25, -0.42),
        vec2(0.25, -0.52),
        vec2(0.1, -0.52),

        vec2(0.3, -0.42),
        vec2(0.45, -0.42),
        vec2(0.45, -0.52),
        vec2(0.3, -0.52),

    ];

    // Load the data into the GPU
    building_bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, building_bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(building_vertices), gl.STATIC_DRAW);
    // Associate out shader variables with our data buffer
    building_vPosition = gl.getAttribLocation(program, "vPosition");


    //
    // Sky
    //

    // Sky vertices and colors
    var skyTop_vertices = [

        vec2(-0.6, 1),     //v0
        vec2(0.6, 1),      //v1
        vec2(-0.6, 0.4),   //v2
        vec2(0.6, 0.4),    //v3
    ];

    var skyTop_colors = [

        vec4(0.62, 0.39, 0.76, 1.0),  //v0
        vec4(0.62, 0.39, 0.76, 1.0),  //v1
        vec4(0.4, 0.28, 0.68, 1.0),   //v2
        vec4(0.4, 0.28, 0.68, 1.0),   //v3
    ];

    var skyBottom_vertices = [

        vec2(-0.6, 0.32),  //v0
        vec2(0.6, 0.32),   //v1
        vec2(-0.6, -0.57), //v2
        vec2(0.6, -0.57),  //v3
    ];

    var skyBottom_colors = [

        vec4(0.4, 0.28, 0.68, 1.0),  //v0
        vec4(0.4, 0.28, 0.68, 1.0),  //v1
        vec4(0.2, 0.18, 0.65, 1.0),  //v2
        vec4(0.2, 0.18, 0.65, 1.0),  //v3
    ];


    // Load the data into the GPU
    skyTop_bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, skyTop_bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(skyTop_vertices), gl.STATIC_DRAW);
    // Associate out shader variables with our data buffer
    skyTop_vPosition = gl.getAttribLocation(program, "vPosition");

    // Load the data into the GPU
    skyTopColors_bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, skyTopColors_bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(skyTop_colors), gl.STATIC_DRAW);
    // Associate out shader variables with our data buffer
    skyTopColors_vPosition = gl.getAttribLocation(program, "vPosition");

    // Load the data into the GPU
    skyBottom_bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, skyBottom_bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(skyBottom_vertices), gl.STATIC_DRAW);
    // Associate out shader variables with our data buffer
    skyBottom_vPosition = gl.getAttribLocation(program, "vPosition");

    // Load the data into the GPU
    skyBottomColors_bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, skyBottomColors_bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(skyBottom_colors), gl.STATIC_DRAW);
    // Associate out shader variables with our data buffer
    skyBottomColors_vPosition = gl.getAttribLocation(program, "vPosition");



    //
    // Tree
    //

    // Tree vertices
    var tree_vertices = [

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

    // Load the data into the GPU
    tree_bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tree_bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(tree_vertices), gl.STATIC_DRAW);
    // Associate out shader variables with our data buffer
    tree_vPosition = gl.getAttribLocation(program, "vPosition");



    //
    // Curtain
    //

    // Curtain vertices and colors
    var curtain_vertices = [

        vec2(-0.68, 1),        //v1
        vec2(0.68, 1),         //v2
        vec2(-0.68, -0.64),    //v3
        vec2(0.68, -0.64),     //v4
    ]

    var curtain_colors = [

        vec4(0.4, 0.28, 0.68, 1.0),   //v1
        vec4(0.4, 0.28, 0.68, 1.0),   //v2
        vec4(0.2, 0.8, 0.65, 1.0),    //v3
        vec4(0.2, 0.8, 0.65, 1.0),    //v4
        
    ];

    // Load the data into the GPU
    curtain_bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, curtain_bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(curtain_vertices), gl.STATIC_DRAW);
    // Associate out shader variables with our data buffer
    curtain_vPosition = gl.getAttribLocation(program, "vPosition");

    // Load the data into the GPU
    curtainColors_bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, curtainColors_bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(curtain_colors), gl.STATIC_DRAW);
    // Associate out shader variables with our data buffer
    curtainColors_vPosition = gl.getAttribLocation(program_curtain, "vPosition");

    
    render();
};


function render() {

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);

    // Draw windows
    gl.bindBuffer(gl.ARRAY_BUFFER, window_bufferId);
    gl.vertexAttribPointer(window_vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(window_vPosition);
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


    // Draw sky
    gl.bindBuffer(gl.ARRAY_BUFFER, skyTop_bufferId);
    gl.vertexAttribPointer(skyTop_vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(skyTop_vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, skyTopColors_bufferId);
    gl.enableVertexAttribArray(vColor);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, skyBottom_bufferId);
    gl.vertexAttribPointer(skyBottom_vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(skyBottom_vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, skyBottomColors_bufferId);
    gl.enableVertexAttribArray(vColor);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);


    // Draw buildings
    gl.bindBuffer(gl.ARRAY_BUFFER, building_bufferId);
    gl.vertexAttribPointer(building_vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(building_vPosition);
    gl.disableVertexAttribArray(vColor);

    gl.vertexAttrib4f(vColor, 0.95, 0.55, 0.71, 1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.vertexAttrib4f(vColor, 0.95, 0.55, 0.71, 1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 4, 4);

    gl.vertexAttrib4f(vColor, 0.9, 0.25, 0.41, 1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 8, 4);

    gl.vertexAttrib4f(vColor, 0.9, 0.4, 0.51, 1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 12, 4);

    gl.vertexAttrib4f(vColor, 0.6, 0.8, 0.6, 1.0);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.vertexAttrib4f(vColor, 0.4, 0.6, 0.4, 1.0);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.vertexAttrib4f(vColor, 0.4, 0.6, 0.4, 1.0);
    gl.drawArrays(gl.TRIANGLE_FAN, 24, 4);
    gl.vertexAttrib4f(vColor, 0.3, 0.7, 0.2, 1.0);
    gl.drawArrays(gl.TRIANGLE_FAN, 28, 4);
    gl.vertexAttrib4f(vColor, 0.6, 0.8, 0.6, 1.0);
    gl.drawArrays(gl.TRIANGLE_FAN, 32, 4);
    gl.vertexAttrib4f(vColor, 0.6, 0.5, 0.1, 1.0);
    gl.drawArrays(gl.TRIANGLE_FAN, 36, 4);


    // Draw trees
    gl.bindBuffer(gl.ARRAY_BUFFER, tree_bufferId);
    gl.vertexAttribPointer(tree_vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(tree_vPosition);
    gl.disableVertexAttribArray(vColor);

    // leaf
    gl.vertexAttrib4f(vColor, 0.7, 0.7, 0.2, 1.0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.uniform4fv(offset, [0, -0.2, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.uniform4fv(offset, [0, -0.4, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.uniform4fv(offset, [0.24, -0.2, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.uniform4fv(offset, [0.24, -0.4, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.uniform4fv(offset, [0, 0, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // body
    gl.vertexAttrib4f(vColor, 0.4, 0.4, 0.2, 1.0);
    gl.drawArrays(gl.TRIANGLES, 3, 6);

    gl.uniform4fv(offset, [0.24, 0, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 3, 6);

    gl.uniform4fv(offset, [0, 0, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 3, 6);


    // Draw stars
    gl.bindBuffer(gl.ARRAY_BUFFER, star_bufferId);
    gl.vertexAttribPointer(star_vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(star_vPosition);
    gl.disableVertexAttribArray(vColor);
    gl.vertexAttrib4f(vColor, 0.0, 0.9, 0.6, 1.0);

    for (var i = 0; i < index; i += 8) {
        gl.drawArrays(gl.LINE_LOOP, i, 8);
    }


    // Draw moon
    gl.useProgram(program_moon);
    thetaLoc = gl.getUniformLocation(program_moon, "theta");

    gl.enableVertexAttribArray(moon_vPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, moon_bufferId);
    gl.vertexAttribPointer(moon_vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.disableVertexAttribArray(vColor);
    gl.vertexAttrib4f(vColor, 1.0, 1.0, 0.8, 1.0);

    theta += (direction ? 0.02 : -0.02);
    gl.uniform1f(thetaLoc, theta);
    var translation = [-0.3, 0.7, 0, 0];
    gl.uniform4fv(translationLocation_moon, translation);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 8);



    // Draw curtain
    gl.useProgram(program_curtain);
    gl.bindBuffer(gl.ARRAY_BUFFER, curtain_bufferId);
    gl.vertexAttribPointer(curtain_vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(curtain_vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, curtainColors_bufferId);
    gl.enableVertexAttribArray(vColor);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    translation = [0.0, 0.16*open, 0, 0];
    gl.uniform4fv(translationLocation_curtain, translation);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);


    window.requestAnimFrame(render);
}