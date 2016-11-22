#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;

//varying vec2 vTextureCoord;

void main() {
	//vec4 textureColor = texture2D(uSampler, vTextureCoord);
	//gl_FragColor = textureColor;
	gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
