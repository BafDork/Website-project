export const particleVert = `
    uniform sampler2D texturePosition;
    attribute vec2 reference;
    varying float v_op;


    void main()
    {
        vec3 position = texture2D(texturePosition, reference).xyz;
        position *= 3.;

        vec3 transformed = vec3(position);
        vec4 mvpos = modelViewMatrix * vec4(transformed, 1.0);

        gl_PointSize = clamp(2. - length(transformed) * .01, 0., 2.);
        v_op = 1. / length(position) * 8.;
        gl_Position = projectionMatrix * mvpos;
    }
`;