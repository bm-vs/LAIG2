#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float du;
uniform float dv;

uniform float su;
uniform float sv;

uniform vec3 color1;
uniform vec3 color2;
uniform vec3 colors;


void main() {
	vec4 textureColor = texture2D(uSampler, vTextureCoord);
	vec4 col1 = vec4(color1, 1.0);
	vec4 col2 = vec4(color2, 1.0);
	vec4 cols = vec4(colors, 1.0);

	if (vTextureCoord.x > su/du && vTextureCoord.x < (su+1.0)/du && vTextureCoord.y > sv/dv && vTextureCoord.y < (sv+1.0)/dv) {
		gl_FragColor = textureColor*cols;
	}
	else if ((mod(du/2.0*vTextureCoord.x, 1.0) < 0.5) ^^ (mod(dv/2.0*vTextureCoord.y, 1.0) < 0.5)) {
		gl_FragColor = textureColor*col1;
	}
	else {
		gl_FragColor = textureColor*col2;
	}
}
