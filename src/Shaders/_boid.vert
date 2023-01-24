// Vertex Shader
precision highp float;

// Attributes
attribute vec3 position;
attribute vec3 velocity;

// Uniforms
uniform mat4 worldViewProjection;
uniform float time;
uniform vec3 boidPositions[100];
uniform vec3 boidVelocities[100];
uniform int boidCount;
uniform float separationDistance;
uniform float alignmentDistance;
uniform float cohesionDistance;

// Varying
varying vec3 vPosition;

void main(void) {
    vec3 separation = vec3(0.0, 0.0, 0.0);
    vec3 alignment = vec3(0.0, 0.0, 0.0);
    vec3 cohesion = vec3(0.0, 0.0, 0.0);
    int neighborCount = 0;

    for(int i = 0; i < boidCount; i++) {
        if(i == gl_VertexID) {
            continue;
        }

        vec3 neighborPosition = boidPositions[i];
        vec3 distance = neighborPosition - position;
        float distanceLength = length(distance);

        if(distanceLength < separationDistance) {
            separation += normalize(distance) / distanceLength;
            neighborCount++;
        } else if(distanceLength < alignmentDistance) {
            alignment += boidVelocities[i];
            neighborCount++;
        } else if(distanceLength < cohesionDistance) {
            cohesion += neighborPosition;
            neighborCount++;
        }
    }

    if(neighborCount > 0) {
        separation = normalize(separation) * 0.5;
        alignment = normalize(alignment) * 0.5;
        cohesion = normalize(cohesion / float(neighborCount)) * 0.5;
    }

    vec3 newVelocity = velocity + separation + alignment + cohesion;
    vec3 newPosition = position + newVelocity * time;
    vPosition = newPosition;
    gl_Position = worldViewProjection * vec4(newPosition, 1.0);
}
