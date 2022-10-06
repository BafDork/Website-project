export const positionFrag = `
    uniform sampler2D v_samplerPosition_orig;
    uniform sampler2D u_noise;
    uniform float delta;

    vec3 hash3(vec2 p)
    {
        vec3 o = texture2D( u_noise, (p+0.5)/256.0, -100.0 ).xyz;
        return o;
    }

    void main() 
    {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec3 position_original = texture2D(v_samplerPosition_orig, uv).xyz;
        vec3 position = texture2D(v_samplerPosition, uv).xyz;
        vec3 velocity = texture2D(v_samplerVelocity, uv).xyz * .5;

        vec3 pos = position + velocity * delta;
        vec3 hash = hash3(position_original.xy * position_original.zx * 20.);
        
        pos *= 1. + (hash - .5) * .0005;
        pos += (hash - .5) * .001;
        
        if (length(pos) > 40.) pos = position_original;
   
        gl_FragColor = vec4(pos, 1.0);
    }
`;