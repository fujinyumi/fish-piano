// *******************************************************
// CS 174a Graphics Example Code
// animation.js - The main file and program start point.  The class definition here describes how to display an Animation and how it will react to key and mouse input.  Right now it has 
// very little in it - you will fill it in with all your shape drawing calls and any extra key / mouse controls.  

// Now go down to display() to see where the sample shapes are drawn, and to see where to fill in your own code.

"use strict"
var canvas, canvas_size, gl = null, g_addrs,
	movement = vec2(),	thrust = vec3(), 	looking = false, prev_time = 0, animate = false, animation_time = 0;
		var gouraud = false, color_normals = false, solid = false;
function CURRENT_BASIS_IS_WORTH_SHOWING(self, model_transform) { self.m_axis.draw( self.basis_id++, self.graphicsState, model_transform, new Material( vec4( .8,.3,.8,1 ), .5, 1, 1, 40, "" ) ); }


// *******************************************************
// IMPORTANT -- In the line below, add the filenames of any new images you want to include for textures!

var texture_filenames_to_load = [ "stars.png", "text.png", "earth.gif", "skybox.png", "grid.png", "glow.png", "fishscales.png" ];

// *******************************************************	
// When the web page's window loads it creates an "Animation" object.  It registers itself as a displayable object to our other class "GL_Context" -- which OpenGL is told to call upon every time a
// draw / keyboard / mouse event happens.

//sounds
var C = new Audio('sounds/C.mp3'); var C2 = new Audio('sounds/C2.mp3'); var C3 = new Audio('sounds/C3.mp3'); 
var D = new Audio('sounds/D.mp3'); var D2 = new Audio('sounds/D2.mp3');
var E = new Audio('sounds/E.mp3'); var E2 = new Audio('sounds/E2.mp3');
var F = new Audio('sounds/F.mp3'); var F2 = new Audio('sounds/F2.mp3');
var G = new Audio('sounds/G.mp3'); var G2 = new Audio('sounds/G2.mp3');
var A = new Audio('sounds/A.mp3'); var A2 = new Audio('sounds/A2.mp3');
var B = new Audio('sounds/B.mp3'); var B2 = new Audio('sounds/B2.mp3');

var C_f = new Audio('sounds/C_f.mp3'); var C2_f = new Audio('sounds/C2_f.mp3'); var C3_f = new Audio('sounds/C3_f.mp3'); 
var D_f = new Audio('sounds/D_f.mp3'); var D2_f = new Audio('sounds/D2_f.mp3');
var E_f = new Audio('sounds/E_f.mp3'); var E2_f = new Audio('sounds/E2_f.mp3');
var F_f = new Audio('sounds/F_f.mp3'); var F2_f = new Audio('sounds/F2_f.mp3');
var G_f = new Audio('sounds/G_f.mp3'); var G2_f = new Audio('sounds/G2_f.mp3');
var A_f = new Audio('sounds/A_f.mp3'); var A2_f = new Audio('sounds/A2_f.mp3');
var B_f = new Audio('sounds/B_f.mp3'); var B2_f = new Audio('sounds/B2_f.mp3');

var C_v = new Audio('sounds/C_v.mp3'); var C2_v = new Audio('sounds/C2_v.mp3'); var C3_v = new Audio('sounds/C3_v.mp3'); 
var D_v = new Audio('sounds/D_v.mp3'); var D2_v = new Audio('sounds/D2_v.mp3');
var E_v = new Audio('sounds/E_v.mp3'); var E2_v = new Audio('sounds/E2_v.mp3');
var F_v = new Audio('sounds/F_v.mp3'); var F2_v = new Audio('sounds/F2_v.mp3');
var G_v = new Audio('sounds/G_v.mp3'); var G2_v = new Audio('sounds/G2_v.mp3');
var A_v = new Audio('sounds/A_v.mp3'); var A2_v = new Audio('sounds/A2_v.mp3');
var B_v = new Audio('sounds/B_v.mp3'); var B2_v = new Audio('sounds/B2_v.mp3');

var C_h = new Audio('sounds/C_h.mp3'); var C2_h = new Audio('sounds/C2_h.mp3'); var C3_h = new Audio('sounds/C3_h.mp3'); 
var D_h = new Audio('sounds/D_h.mp3'); var D2_h = new Audio('sounds/D2_h.mp3');
var E_h = new Audio('sounds/E_h.mp3'); var E2_h = new Audio('sounds/E2_h.mp3');
var F_h = new Audio('sounds/F_h.mp3'); var F2_h = new Audio('sounds/F2_h.mp3');
var G_h = new Audio('sounds/G_h.mp3'); var G2_h = new Audio('sounds/G2_h.mp3');
var A_h = new Audio('sounds/A_h.mp3'); var A2_h = new Audio('sounds/A2_h.mp3');
var B_h = new Audio('sounds/B_h.mp3'); var B2_h = new Audio('sounds/B2_h.mp3');

var C_m = new Audio('sounds/C_m.mp3'); var C2_m = new Audio('sounds/C2_m.mp3'); var C3_m = new Audio('sounds/C3_m.mp3'); 
var D_m = new Audio('sounds/D_m.mp3'); var D2_m = new Audio('sounds/D2_m.mp3');
var E_m = new Audio('sounds/E_m.mp3'); var E2_m = new Audio('sounds/E2_m.mp3');
var F_m = new Audio('sounds/F_m.mp3'); var F2_m = new Audio('sounds/F2_m.mp3');
var G_m = new Audio('sounds/G_m.mp3'); var G2_m = new Audio('sounds/G2_m.mp3');
var A_m = new Audio('sounds/A_m.mp3'); var A2_m = new Audio('sounds/A2_m.mp3');
var B_m = new Audio('sounds/B_m.mp3'); var B2_m = new Audio('sounds/B2_m.mp3');


//constants
var square_size = 5;
var between = 0.1;
var grid_shift = 4;
var grid_len = 15;

//framerate
var framerate = 0;

//tracking movement of fish
var fishposx = 0;
var fishposz = 0;

//absolute position of fish to check fish does not go out of bounds
var afishposx = -7*square_size-7*between; 
var afishposz = 7*square_size+7*between;

var speed = 0.005;

//keys pressed
var keys = {
	w: false,
	a: false,
	s: false,
	d: false,
	space: false
};

//current pressed direction
//0 is default state
//1 for w, 2 for a, 3 for s, and 4 for d
var curdir = 0;

//current fish direction
//1 for N, 2 for W, 3 for S, and 4 for E
var fishdir = 1;

//slopes for segments of tail
var TAIL_S_1 = 0.7;
var TAIL_S_2 = 0.75;
var TAIL_S_3 = 0.8;
var TAIL_S_4 = 0.85;
var TAIL_S_5 = 0.9;
var TAIL_S_6 = 0.95;
var TAIL_S_7 = 1;
var TAIL_S_8 = 1.1;
var TAIL_S_9 = 1.2;
var TAIL_S_10 = 1.3;

window.onload = function init() {	var anim = new Animation();	}
function Animation()
{
	( function init (self) 
	{
		self.context = new GL_Context( "gl-canvas" );
		self.context.register_display_object( self );
		
		gl.clearColor( 0, 0, 0, 1 );			// Background color
		
		for( var i = 0; i < texture_filenames_to_load.length; i++ )
			initTexture( texture_filenames_to_load[i], true );
		
		self.m_cube = new cube();
		self.m_obj = new shape_from_file( "teapot.obj" )
		self.m_axis = new axis();
		self.m_sphere = new sphere( mat4(), 4 );	
		self.m_fan = new triangle_fan_full( 10, mat4() );
		self.m_strip = new rectangular_strip( 1, mat4() );
		self.m_cylinder = new cylindrical_strip( 10, mat4() );
		self.m_capped = new capped_cylinder();
		self.m_fish = new fish_body();
		
		//pieces of tail need different radii, sort of unwieldy...
		self.m_tail_1 = new tilted_strip(20, mat4(), 1, TAIL_S_1);
		self.m_tail_2 = new tilted_strip(20, mat4(), 1, TAIL_S_2);
		self.m_tail_3 = new tilted_strip(20, mat4(), 1, TAIL_S_3);
		self.m_tail_4 = new tilted_strip(20, mat4(), 1, TAIL_S_4);
		self.m_tail_5 = new tilted_strip(20, mat4(), 1, TAIL_S_5);
		self.m_tail_6 = new tilted_strip(20, mat4(), 1, TAIL_S_6);
		self.m_tail_7 = new tilted_strip(20, mat4(), 1, TAIL_S_7);
		self.m_tail_8 = new tilted_strip(20, mat4(), 1, TAIL_S_8);
		self.m_tail_9 = new tilted_strip(20, mat4(), 1, TAIL_S_9);
		self.m_tail_10 = new tilted_strip(20, mat4(), 1, TAIL_S_10);
		
		self.m_triprism = new triangle_prism();
		
		// 1st parameter is camera matrix.  2nd parameter is the projection:  The matrix that determines how depth is treated.  It projects 3D points onto a plane.
		self.graphicsState = new GraphicsState( translation(0, 0,-40), perspective(45, canvas.width/canvas.height, .1, 1000), 0 );

		gl.uniform1i( g_addrs.GOURAUD_loc, gouraud);		gl.uniform1i( g_addrs.COLOR_NORMALS_loc, color_normals);		gl.uniform1i( g_addrs.SOLID_loc, solid);
		
		self.context.render();	
	} ) ( this );	
	
	canvas.addEventListener('mousemove', function(e)	{		e = e || window.event;		movement = vec2( e.clientX - canvas.width/2, e.clientY - canvas.height/2, 0);	});
}

// *******************************************************	
// init_keys():  Define any extra keyboard shortcuts here
Animation.prototype.init_keys = function()
{	
	shortcut.add("w", function() { keys['w'] = true; curdir = 1; } );	shortcut.add("w", function() { keys['w'] = false; }, {'type':'keyup'} );
	shortcut.add("a", function() { keys['a'] = true; curdir = 2; } );	shortcut.add("a", function() { keys['a'] = false; }, {'type':'keyup'} );
	shortcut.add("s", function() { keys['s'] = true; curdir = 3; } );	shortcut.add("s", function() { keys['s'] = false; }, {'type':'keyup'} );
	shortcut.add("d", function() { keys['d'] = true; curdir = 4; } );	shortcut.add("d", function() { keys['d'] = false; }, {'type':'keyup'} );
	shortcut.add("Space", function() { keys['space'] = true; speed = 0.01; } );	shortcut.add("Space", function() { keys['space'] = false; speed = 0.005; }, {'type': 'keyup'} );
	shortcut.add( "ALT+a", function() { animate = !animate; } );
}

function update_camera( self, animation_delta_time )
	{
		var leeway = 70, border = 50;
		var degrees_per_frame = .0002 * animation_delta_time;
		var meters_per_frame  = .01 * animation_delta_time;
																					// Determine camera rotation movement first
		var movement_plus  = [ movement[0] + leeway, movement[1] + leeway ];		// movement[] is mouse position relative to canvas center; leeway is a tolerance from the center.
		var movement_minus = [ movement[0] - leeway, movement[1] - leeway ];
		var outside_border = false;
		
		for( var i = 0; i < 2; i++ )
			if ( Math.abs( movement[i] ) > canvas_size[i]/2 - border )	outside_border = true;		// Stop steering if we're on the outer edge of the canvas.

		for( var i = 0; looking && outside_border == false && i < 2; i++ )			// Steer according to "movement" vector, but don't start increasing until outside a leeway window from the center.
		{
			var velocity = ( ( movement_minus[i] > 0 && movement_minus[i] ) || ( movement_plus[i] < 0 && movement_plus[i] ) ) * degrees_per_frame;	// Use movement's quantity unless the &&'s zero it out
			self.graphicsState.camera_transform = mult( rotation( velocity, i, 1-i, 0 ), self.graphicsState.camera_transform );			// On X step, rotate around Y axis, and vice versa.
		}
		self.graphicsState.camera_transform = mult( translation( scale_vec( meters_per_frame, thrust ) ), self.graphicsState.camera_transform );		// Now translation movement of camera, applied in local camera coordinate frame
	}

// *******************************************************	
// display(): called once per frame, whenever OpenGL decides it's time to redraw.

Animation.prototype.display = function(time)
	{
		if(!time) time = 0;
		this.animation_delta_time = time - prev_time;
		if(animate) this.graphicsState.animation_time += this.animation_delta_time;
		prev_time = time;

		framerate = 1/(this.animation_delta_time/1000);
		
		update_camera( this, this.animation_delta_time );
		
		if(animate) {
		//update location
		if (keys['w'] == true) {
			if ((afishposz-speed*this.animation_delta_time) > (-7.5*square_size-7*between)) { fishposz += speed*this.animation_delta_time; afishposz -= speed*this.animation_delta_time; }
		}
		if (keys['a'] == true) {
			if ((afishposx-speed*this.animation_delta_time) > (-7.5*square_size-7*between)) { fishposx += speed*this.animation_delta_time; afishposx -= speed*this.animation_delta_time; }
		}
		if (keys['s'] == true) {
			if ((afishposz+speed*this.animation_delta_time) < (7.5*square_size+7*between)) { fishposz -= speed*this.animation_delta_time; afishposz += speed*this.animation_delta_time; }
		}
		if (keys['d'] == true) {
			if ((afishposx+speed*this.animation_delta_time) < (7.5*square_size+7*between)) { fishposx -= speed*this.animation_delta_time; afishposx += speed*this.animation_delta_time; }
		}
		}
			
		this.basis_id = 0;
		
		var model_transform = mat4();
		
		// Materials: Declare new ones as needed in every function.
		// 1st parameter:  Color (4 floats in RGBA format), 2nd: Ambient light, 3rd: Diffuse reflectivity, 4th: Specular reflectivity, 5th: Smoothness exponent, 6th: Texture image.
		var purplePlastic = new Material( vec4( .9,.5,.9,1 ), .2, .5, .8, 40 ), // Omit the final (string) parameter if you want no texture
			greyPlastic = new Material( vec4( .5,.5,.5,1 ), .2, .8, .5, 20 ),
			earth = new Material( vec4( .5,.5,.5,1 ), .5, 1, .5, 40, "earth.gif" ),
			stars = new Material( vec4( .5,.5,.5,1 ), .5, 1, 1, 40, "stars.png" ),
			skybox = new Material( vec4( 0, 0, 0, 1), 1, 1, 1, 40, "skybox.png"),
			gridsquare = new Material( vec4(0, 0, 0, 0.1), 0.7, 1, 1, 40, "grid.png" ),
			litgrid = new Material( vec4(0, 0, 0, 1), 1, 1, 1, 40, "glow.png" ),
			fish = new Material( vec4(0, 0, 0, 1), .8, .5, .8, 40, "fishscales.png" ),
			fishtail = new Material( vec4(0.8, 0.5, 0, 1), 0.9, 0.5, 0.2, 40);
			
			this.graphicsState.camera_transform = lookAt( vec3(-7*square_size-7*between-5-fishposx, 1, 7*square_size+7*between+20-fishposz), vec3(-7*square_size-7*between-fishposx,0, 7*square_size+7*between-fishposz), vec3(0, 1, 0));
		
		//starting check coords
		var startn = -7.5*square_size-7*between;
		var startw = -7.5*square_size-7*between;
		var starts = -6.5*square_size-7*between;
		var starte = -6.5*square_size-7*between;

		var litx = -1;
		var litz = -1;
		
		//check which square fish is over
		for (var i = 0; i < 15; i++) {
			for (var j = 0; j < 15; j++) {
				var n = startn + i*square_size + i*between;
				var w = startw + j*square_size + j*between;
				var s = starts + i*square_size + i*between;
				var e = starte + j*square_size + j*between;
				if (afishposz >= n && afishposz <= s && afishposx >= w && afishposx <= e) {
					litx = j;
					litz = i;
				}
			}
		}
		
		if(animate) {
		//play sound
		switch(litz) {
			case 0:
				if (litx % 5 == 0) C3.play();
				else if (litx % 5 == 1) C3_f.play();
				else if (litx % 5 == 2) C3_v.play();
				else if (litx % 5 == 3) C3_h.play();
				else if (litx % 5 == 4) C3_m.play();
				break;
			case 1:
				if (litx % 5 == 0) B2.play();
				else if (litx % 5 == 1) B2_f.play();
				else if (litx % 5 == 2) B2_v.play();
				else if (litx % 5 == 3) B2_h.play();
				else if (litx % 5 == 4) B2_m.play();
				break;
			case 2:
				if (litx % 5 == 0) A2.play();
				else if (litx % 5 == 1) A2_f.play();
				else if (litx % 5 == 2) A2_v.play();
				else if (litx % 5 == 3) A2_h.play();
				else if (litx % 5 == 4) A2_m.play();
				break;
			case 3:
				if (litx % 5 == 0) G2.play();
				else if (litx % 5 == 1) G2_f.play();
				else if (litx % 5 == 2) G2_v.play();
				else if (litx % 5 == 3) G2_h.play();
				else if (litx % 5 == 4) G2_m.play();
				break;
			case 4:
				if (litx % 5 == 0) F2.play();
				else if (litx % 5 == 1) F2_f.play();
				else if (litx % 5 == 2) F2_v.play();
				else if (litx % 5 == 3) F2_h.play();
				else if (litx % 5 == 4) F2_m.play();
				break;
			case 5:
				if (litx % 5 == 0) E2.play();
				else if (litx % 5 == 1) E2_f.play();
				else if (litx % 5 == 2) E2_v.play();
				else if (litx % 5 == 3) E2_h.play();
				else if (litx % 5 == 4) E2_m.play();
				break;
			case 6:
				if (litx % 5 == 0) D2.play();
				else if (litx % 5 == 1) D2_f.play();
				else if (litx % 5 == 2) D2_v.play();
				else if (litx % 5 == 3) D2_h.play();
				else if (litx % 5 == 4) D2_m.play();
				break;
			case 7:
				if (litx % 5 == 0) C2.play();
				else if (litx % 5 == 1) C2_f.play();
				else if (litx % 5 == 2) C2_v.play();
				else if (litx % 5 == 3) C2_h.play();
				else if (litx % 5 == 4) C2_m.play();
				break;
			case 8:
				if (litx % 5 == 0) B.play();
				else if (litx % 5 == 1) B_f.play();
				else if (litx % 5 == 2) B_v.play();
				else if (litx % 5 == 3) B_h.play();
				else if (litx % 5 == 4) B_m.play();
				break;
			case 9:
				if (litx % 5 == 0) A.play();
				else if (litx % 5 == 1) A_f.play();
				else if (litx % 5 == 2) A_v.play();
				else if (litx % 5 == 3) A_h.play();
				else if (litx % 5 == 4) A_m.play();
				break;
			case 10:
				if (litx % 5 == 0) G.play();
				else if (litx % 5 == 1) G_f.play();
				else if (litx % 5 == 2) G_v.play();
				else if (litx % 5 == 3) G_h.play();
				else if (litx % 5 == 4) G_m.play();
				break;
			case 11:
				if (litx % 5 == 0) F.play();
				else if (litx % 5 == 1) F_f.play();
				else if (litx % 5 == 2) F_v.play();
				else if (litx % 5 == 3) F_h.play();
				else if (litx % 5 == 4) F_m.play();
				break;
			case 12:
				if (litx % 5 == 0) E.play();
				else if (litx % 5 == 1) E_f.play();
				else if (litx % 5 == 2) E_v.play();
				else if (litx % 5 == 3) E_h.play();
				else if (litx % 5 == 4) E_m.play();
				break;
			case 13:
				if (litx % 5 == 0) D.play();
				else if (litx % 5 == 1) D_f.play();
				else if (litx % 5 == 2) D_v.play();
				else if (litx % 5 == 3) D_h.play();
				else if (litx % 5 == 4) D_m.play();
				break;
			case 14:
				if (litx % 5 == 0) C.play();
				else if (litx % 5 == 1) C_f.play();
				else if (litx % 5 == 2) C_v.play();
				else if (litx % 5 == 3) C_h.play();
				else if (litx % 5 == 4) C_m.play();
				break;
			default:
				break;
		}
		}
		
		model_transform = this.draw_skybox(model_transform, skybox);
		model_transform = this.draw_grid(model_transform, litx, litz, gridsquare, litgrid);
		model_transform = this.draw_fish(model_transform, fishposx, fishposz, fish, fishtail);
		
	}	


//model_transform stack
var stack = [];

Animation.prototype.update_strings = function( debug_screen_strings )		// Strings this particular class contributes to the UI
{
	debug_screen_strings.string_map["time"] = "Animation Time: " + this.graphicsState.animation_time/1000 + "s";
	//debug_screen_strings.string_map["basis"] = "Showing basis: " + this.m_axis.basis_selection;
	debug_screen_strings.string_map["animate"] = "Animation " + (animate ? "on" : "off") ;
	//debug_screen_strings.string_map["thrust"] = "Thrust: " + thrust;
	debug_screen_strings.string_map["framerate"] = "Framerate: " + framerate + "s";
}

Animation.prototype.draw_skybox = function( model_transform, texture ) {
		stack.push(model_transform);
		
		model_transform = mult(model_transform, scale(1000, 500, 500));
		this.m_cube.draw( this.graphicsState, model_transform, texture);
		
		model_transform = stack.pop();
		return model_transform;
}

Animation.prototype.draw_grid = function( model_transform, litx, litz, texture, littex ) {
	stack.push(model_transform);
	
	//move downwards
	model_transform = mult(model_transform, translation(0, -5, 0));
	model_transform = mult(model_transform, scale(square_size, 0.4, square_size));
	
	model_transform = mult(model_transform, translation(-7-7*(between/square_size), 0, -7-7*(between/square_size)));
	
	//make 7x7 grid
	for (var i = 0; i < grid_len; i++) {
		for (var j = 0; j < grid_len; j++) {
			if(j == litx && i == litz)
				this.m_cube.draw( this.graphicsState, model_transform, littex);
			else
				this.m_cube.draw( this.graphicsState, model_transform, texture);
			model_transform = mult(model_transform, translation(1+between/square_size, 0, 0));
		}
		model_transform = mult(model_transform, translation(-grid_len-grid_len*(between/square_size), 0, 0));
		model_transform = mult(model_transform, translation(0, 0, 1+between/square_size));
	}
	
	model_transform = stack.pop();
	
	return model_transform;
}

var BODY_RAD = 1;
var BODY_WIDTH = 0.8;
var BODY_LEN = 4;
var TAIL_SCALE = 0.2;
var FIN_WIDTH = 0.1;
var FIN_LEN = 0.3;
var TAILFIN_HEIGHT = 1.5;
var TAILFIN_LEN = 0.75;

Animation.prototype.draw_fish = function(model_transform, posx, posz, texture, tailtexture) {
	
	//model_transform = mult(model_transform, rotation(90, 0, 1, 0));
	stack.push(model_transform);
	
	//move to correct location on grid
	model_transform = mult(model_transform, translation(-7*square_size-7*between, -(3*grid_shift)/4, 7*square_size+7*between));
	model_transform = mult(model_transform, rotation(180, 0, 1, 0));

	model_transform = mult(model_transform, translation(posx, 0, posz));
	
	//face correct direction
	if (curdir == 1) {
		switch (fishdir) {
			case 1: //facing north, face north
				break;
			case 2: //facing west, face north
				model_transform = mult(model_transform, rotation(90, 0, 1, 0));
				break;
			case 3: //facing south, face north
				model_transform = mult(model_transform, rotation(180, 0, 1, 0));
				break;
			case 4: //facing east, face north
				model_transform = mult(model_transform, rotation(-90, 0, 1, 0));
				break;
			default: //???
				break;
		}
	}
	else if (curdir == 2) {
		switch (fishdir) {
			case 1: //facing north, face west
				model_transform = mult(model_transform, rotation(90, 0, 1, 0));
				break;
			case 2: //facing west, face west
				break;
			case 3: //facing south, face west
				model_transform = mult(model_transform, rotation(-90, 0, 1, 0));
				break;
			case 4: //facing east, face west
				model_transform = mult(model_transform, rotation(180, 0, 1, 0));
				break;
			default: //???
				break;
		}
	}
	else if (curdir == 3){
		switch (fishdir) {
			case 1: //facing north, face south
				model_transform = mult(model_transform, rotation(180, 0, 1, 0));
				break;
			case 2: //facing west, face south
				model_transform = mult(model_transform, rotation(-90, 0, 1, 0));
				break;
			case 3: //facing south, face south
				break;
			case 4: //facing east, face south
				model_transform = mult(model_transform, rotation(90, 0, 1, 0));
				break;
			default: //???
				break;
		}
	}
	else if (curdir == 4) {
		switch (fishdir) {
			case 1: //facing north, face east
				model_transform = mult(model_transform, rotation(-90, 0, 1, 0));
				break;
			case 2: //facing west, face east
				model_transform = mult(model_transform, rotation(180, 0, 1, 0));
				break;
			case 3: //facing south, face east
				model_transform = mult(model_transform, rotation(90, 0, 1, 0));
				break;
			case 4: //facing east, face east
				break;
			default: //???
				break;
		}
	}
	
	stack.push(model_transform);
	
	//body
	model_transform = mult(model_transform, scale(BODY_WIDTH, BODY_RAD, BODY_LEN));
	this.m_fish.draw(this.graphicsState, model_transform, texture);
	model_transform = stack.pop();
	
	stack.push(model_transform);
	
	
	//tail
	//calculate radius of hole at end of body from definition in shapes.js of fish_body
	var hole_radius = Math.sin(Math.PI * 18 / 20)
	
	var movement = 50;
	var currad = hole_radius;
	var curwidth = BODY_WIDTH*hole_radius;
	
	//piece one
	model_transform = mult(model_transform, translation(0, 0, -BODY_LEN/2));
	model_transform = mult(model_transform, rotation(speed*100*5*Math.sin(this.graphicsState.animation_time/(500/(speed*200))), 0, 1, 0));
	model_transform = mult(model_transform, scale(curwidth, currad, TAIL_SCALE));
	model_transform = mult(model_transform, translation(0, 0, -0.5));
	this.m_tail_1.draw(this.graphicsState, model_transform, texture);
	
	//the rest
	for (var i = 0; i < 10; i++) {
		model_transform = mult(model_transform, translation(0, 0, -0.5));
		model_transform = mult(model_transform, scale(1/curwidth, 1/currad, 1/TAIL_SCALE));
		model_transform = mult(model_transform, rotation(5*Math.sin(this.graphicsState.animation_time/(500/(speed*200))+movement), 0, 1, 0));
		movement += 50;
		var multi;
		switch (i) {
			case 0:
				multi = TAIL_S_1;
				break;
			case 1:
				multi = TAIL_S_2;
				break;
			case 2:
				multi = TAIL_S_3;
				break;
			case 3:
				multi = TAIL_S_4;
				break;
			case 4:
				multi = TAIL_S_5;
				break;
			case 5:
				multi = TAIL_S_6;
				break;
			case 6:
				multi = TAIL_S_7;
				break;
			case 7:
				multi = TAIL_S_8;
				break;
			case 8:
				multi = TAIL_S_9;
				break;
			case 9:
				multi = TAIL_S_10;
				break;
			default:
				break;
		}
		currad *= multi;
		curwidth *= BODY_WIDTH*multi;
		model_transform = mult(model_transform, scale(curwidth, currad, TAIL_SCALE));
		model_transform = mult(model_transform, translation(0, 0, -0.5));
		switch (i) {
			case 0:
				this.m_tail_2.draw(this.graphicsState, model_transform, texture);
				break;
			case 1:
				this.m_tail_3.draw(this.graphicsState, model_transform, texture);
				break;
			case 2:
				this.m_tail_4.draw(this.graphicsState, model_transform, texture);
				break;
			case 3:
				this.m_tail_5.draw(this.graphicsState, model_transform, texture);
				break;
			case 4:
				this.m_tail_6.draw(this.graphicsState, model_transform, texture);
				break;
			case 5:
				this.m_tail_7.draw(this.graphicsState, model_transform, texture);
				break;
			case 6:
				this.m_tail_8.draw(this.graphicsState, model_transform, texture);
				break;
			case 7:
				this.m_tail_9.draw(this.graphicsState, model_transform, texture);
				break;
			case 8:
				this.m_tail_10.draw(this.graphicsState, model_transform, texture);
				break;
			case 9:
				model_transform = mult(model_transform, translation(0, 0, -0.5));
				model_transform = mult(model_transform, rotation(180, 0, 1, 0));
				this.m_fan.draw(this.graphicsState, model_transform, texture);
			default:
				break;
		}
	}
	
	//tail fins
	model_transform = mult(model_transform, scale(1/curwidth, 1/currad, 1/TAIL_SCALE));
	model_transform = mult(model_transform, rotation(90, 0, 1, 0));
	
	stack.push(model_transform);
	
	//top tail piece
	//90-(360*(Math.atan(1/(1/2))))/(2*Math.PI) ~= 26.565
	model_transform = mult(model_transform, rotation(26.565, 0, 0, 1));
	model_transform = mult(model_transform, scale(TAILFIN_LEN, TAILFIN_HEIGHT, currad));
	model_transform = mult(model_transform, translation(0, 0.5, 0));
	this.m_triprism.draw(this.graphicsState, model_transform, tailtexture);
	
	model_transform = stack.pop();
	
	//lower tail piece
	//360-4*((360*Math.atan((1/2)/1))/(2*Math.PI))+2*(90-(360*(Math.atan(1/(1/2))))/(2*Math.PI)) ~= 306.870
	model_transform = mult(model_transform, rotation(-180-26.565, 0, 0, 1));
	//model_transform = mult(model_transform, rotation(180, 1, 0, 0));
	model_transform = mult(model_transform, scale(TAILFIN_LEN, TAILFIN_HEIGHT, currad));
	model_transform = mult(model_transform, translation(0, 0.5, 0));
	this.m_triprism.draw(this.graphicsState, model_transform, tailtexture);
	
	model_transform = stack.pop();
	model_transform = stack.pop();
	
	return model_transform;
	
}