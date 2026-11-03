
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const container = document.getElementById("crystalFlower");

if (container) {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        40,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );
    camera.position.set(0, 0, 6.5);

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.replaceChildren(renderer.domElement);

    // Planet group
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    // Lavender lighting
    scene.add(new THREE.AmbientLight(0x777799, 1.2));

    const keyLight = new THREE.PointLight(0xd6b5ff, 35);
    keyLight.position.set(-3, 2, 4);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x9255ff, 45);
    rimLight.position.set(2, 0, -3);
    scene.add(rimLight);

    // Procedural planet surface
   

const planetMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = normalize(position);

            gl_Position = projectionMatrix *
                modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;

        float hash(vec3 p) {
            p = fract(p * 0.3183099 + 0.1);
            p *= 17.0;
            return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }

        float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);

            return mix(
                mix(
                    mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                    mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x),
                    f.y
                ),
                mix(
                    mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                    mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x),
                    f.y
                ),
                f.z
            );
        }

        float fbm(vec3 p) {
            float value = 0.0;
            float amplitude = 0.5;

            for (int i = 0; i < 5; i++) {
                value += noise(p) * amplitude;
                p *= 2.0;
                amplitude *= 0.5;
            }

            return value;
        }

        void main() {
            vec3 p = normalize(vPosition);

            // Continents
            float terrain = fbm(p * 5.0);
            terrain += noise(p * 11.0) * 0.12;

            float land = smoothstep(0.47, 0.53, terrain);

            vec3 ocean = vec3(0.015, 0.12, 0.32);
            vec3 shallowWater = vec3(0.04, 0.34, 0.52);
            vec3 greenLand = vec3(0.12, 0.34, 0.17);
            vec3 dryLand = vec3(0.48, 0.39, 0.22);

            vec3 color = mix(ocean, shallowWater,
                             smoothstep(0.25, 0.43, terrain));

            vec3 landColor = mix(
                greenLand,
                dryLand,
                smoothstep(0.55, 0.72, terrain)
            );

            color = mix(color, landColor, land);

            // Polar ice
            float ice = smoothstep(0.84, 0.96, abs(p.y));
            color = mix(color, vec3(0.85, 0.91, 0.96), ice);

            // Directional sunlight
            float light = max(
                dot(normalize(vNormal),
                    normalize(vec3(-0.6, 0.4, 1.0))),
                0.0
            );

            color *= 0.16 + light * 1.2;

            gl_FragColor = vec4(color, 1.0);
        }
    `
});

const planet = new THREE.Mesh(
    new THREE.SphereGeometry(1.35, 128, 128),
    planetMaterial
);

planetGroup.add(planet);
// puraneto

const cloudMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 }
    },

    vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;

        void main() {
            vPosition = normalize(position);
            vNormal = normalize(normalMatrix * normal);

            gl_Position = projectionMatrix *
                modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: `
        uniform float uTime;
        varying vec3 vPosition;
        varying vec3 vNormal;

        float hash(vec3 p) {
            p = fract(p * 0.3183099 + 0.1);
            p *= 17.0;
            return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }

        float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);

            return mix(
                mix(
                    mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                    mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x),
                    f.y
                ),
                mix(
                    mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                    mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x),
                    f.y
                ),
                f.z
            );
        }

        void main() {
            vec3 p = normalize(vPosition);

            // Slowly drifting cloud formations
            p.xz += vec2(uTime * 0.012, uTime * 0.006);

            float clouds =
                noise(p * 13.0) * 0.65 +
                noise(p * 27.0) * 0.35;

            float density = smoothstep(0.52, 0.68, clouds);

            float light = max(
                dot(normalize(vNormal),
                    normalize(vec3(-0.6, 0.4, 1.0))),
                0.0
            );

            vec3 cloudColor = mix(
                vec3(0.65, 0.76, 0.88),
                vec3(1.0),
                light
            );

            gl_FragColor = vec4(cloudColor, density * 0.4);
        }
    `,

    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide
});

const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(1.365, 128, 128),
    cloudMaterial
);

planetGroup.add(clouds);

    // Glowing atmosphere
    

const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
            vNormal = normalize(normalMatrix * normal);

            vec4 mvPosition =
                modelViewMatrix * vec4(position, 1.0);

            vViewPosition = -mvPosition.xyz;

            gl_Position = projectionMatrix * mvPosition;
        }
    `,

    fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
            float fresnel = pow(
                1.0 - max(
                    dot(normalize(vNormal),
                        normalize(vViewPosition)),
                    0.0
                ),
                3.0
            );

            vec3 blue = vec3(0.20, 0.62, 1.0);

            gl_FragColor = vec4(
                blue,
                fresnel * 0.48
            );
        }
    `,

    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false
});

const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.42, 96, 96),
    atmosphereMaterial
);

planetGroup.add(atmosphere);

    // Orbital ring
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xb995ff,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
    });

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.9, 0.012, 8, 160),
        ringMaterial
    );

    ring.rotation.x = Math.PI * 0.35;
    ring.rotation.y = -0.2;
    planetGroup.add(ring);

    // Small orbiting satellite

const moonMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 }
    },

    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;

            gl_Position = projectionMatrix
                * modelViewMatrix
                * vec4(position, 1.0);
        }
    `,

    fragmentShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vPosition;

        float hash(vec3 p) {
            p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
            p *= 17.0;
            return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }

        float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);

            return mix(
                mix(
                    mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                    mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x),
                    f.y
                ),
                mix(
                    mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                    mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x),
                    f.y
                ),
                f.z
            );
        }

        void main() {
            vec3 p = normalize(vPosition);

            float terrain = noise(p * 22.0)
                          * 0.55
                          + noise(p * 55.0) * 0.30
                          + noise(p * 100.0) * 0.15;

            float craterField = noise(p * 30.0);
            float craters = smoothstep(0.42, 0.58, craterField);

            vec3 darkRock = vec3(0.20, 0.20, 0.23);
            vec3 lightRock = vec3(0.68, 0.67, 0.65);

            vec3 color = mix(darkRock, lightRock, terrain);
            color *= mix(0.68, 1.0, craters);

            float light = max(
                dot(normalize(vNormal),
                    normalize(vec3(-0.6, 0.4, 1.0))),
                0.0
            );

            color *= 0.20 + light * 1.1;

            gl_FragColor = vec4(color, 1.0);
        }
    `
});

const satellite = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 48, 48),
    moonMaterial
);

scene.add(satellite);


    // Resize support
    function resize() {
        const w = container.clientWidth;
        const h = container.clientHeight;

        if (!w || !h) return;

        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // Animation
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const t = clock.getElapsedTime();
        const pulse = (Math.sin(t * 1.5) + 1) / 2;

        // Slow planet rotation
        planet.rotation.y = t * 0.18;
        planet.rotation.x = 0.08;

        // Slowly rotate the orbital ring with the planet
        ring.rotation.z = t * 0.12;

        // Gentle pulsing atmosphere

        // Satellite follows an elliptical orbit
        const orbitRadius = 2.15;
const orbitTilt = 0.25;
const orbitSpeed = t * 0.35;
// Earth rotation
planet.rotation.y = t * 0.08;

// Clouds rotate slightly faster
clouds.rotation.y = t * 0.095;

// Cloud movement
cloudMaterial.uniforms.uTime.value = t;
satellite.position.set(
    Math.cos(orbitSpeed) * orbitRadius,
    Math.sin(orbitSpeed) * orbitRadius * Math.sin(orbitTilt),
    Math.sin(orbitSpeed) * orbitRadius * Math.cos(orbitTilt)
);

        renderer.render(scene, camera);
    }

    animate();
}

