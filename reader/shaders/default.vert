#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float du;
uniform float dv;

uniform float su;
uniform float sv;

uniform float height;

varying vec2 vTextureCoord;


void main() {
	vec3 up = vec3(0.0, 0.0, height);
	float tx = aTextureCoord.x*du;
	float ty = aTextureCoord.y*dv;	

	if ((floor(tx) == floor(su) && floor(ty) == floor(sv)) ||
	    (floor(tx) == floor(su+1.0) && floor(ty) == floor(sv)) ||
	    (floor(tx) == floor(su) && floor(ty) == floor(sv+1.0)) ||
	    (floor(tx) == floor(su+1.0) && floor(ty) == floor(sv+1.0))) {

	    gl_Position = uPMatrix*uMVMatrix*vec4(aVertexPosition+up, 1.0);
	}
	else {
	    gl_Position = uPMatrix*uMVMatrix*vec4(aVertexPosition, 1.0);
	}

	vTextureCoord = aTextureCoord;
}

