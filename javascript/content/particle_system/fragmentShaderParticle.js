export const particleFrag = `
    varying float v_op;

    void main() 
    {
        vec2 uv = gl_PointCoord.xy - .5;

        vec3 particlecolour = vec3(.5, .56, .56) * 1.8;
        vec3 outercolour = vec3(.6);

        float l = length(uv);
        vec3 colour = mix(outercolour, particlecolour, smoothstep(.9, .1, l));
        colour = mix(vec3(2., 0.5, 0.2), colour, smoothstep(3., 5.5, v_op));

        if (v_op < 0.3) gl_FragColor = vec4(colour, v_op + 0.3);
        else gl_FragColor = vec4(colour, v_op);
    }
`;