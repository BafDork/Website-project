export const velocityFrag = `
    uniform float u_time;
    const int octaves = 3;

    float sinnoise(vec3 loc)
    {

        float t = u_time * 10.;
        vec3 p = loc + u_time;

        for (int i=0; i<octaves; i++)
        {
            p += cos( p.zyx * 3. + vec3(0., t, 1.6)) / 3.;
            p += sin( p.zyx + t + vec3(t, 1.6, 0.)) / 2.;
            p *= 1.2;
        }

        p += fract(sin(p+vec3(13, 7, 3))*5e5)*.03-.015;
        return length(p);
    }

    void main() 
    {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec3 position = texture2D(v_samplerPosition, uv).xyz;
        vec3 velocity = texture2D(v_samplerVelocity, uv).xyz;
        vec3 acceleration = vec3(0.);

        vec3 _pos = position * (smoothstep(1., 3., length(position))) + vec3(u_time, u_time * .2, 0.);
        acceleration = vec3(
            sinnoise(_pos),
            sinnoise(_pos + 10.),
            sinnoise(_pos - 10.)
        );

        acceleration = sin(acceleration) * .5 + .5;
        gl_FragColor = vec4(acceleration, 1.0) * 2. - 1.;
  }
`;