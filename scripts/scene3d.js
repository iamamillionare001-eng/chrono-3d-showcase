// Initialize Three.js scene for high-detail tourbillon watch showcase
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Set up the scene with dark background
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a14);

// Create camera with perspective
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.z = 8;

// Set up renderer with high quality settings
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById('scene-container').appendChild(renderer.domElement);

// Create studio three-point lighting setup
const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
keyLight.position.set(3, 5, 2);
keyLight.castShadow = true;

const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
fillLight.position.set(-3, -2, 1);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
rimLight.position.set(0, 0, -5);

scene.add(keyLight);
scene.add(fillLight);
scene.add(rimLight);

// Add ambient light for overall illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Material definitions for different watch finishes
const materials = {
    'Titanium Silver': new THREE.MeshPhysicalMaterial({
        color: 0xC0C0C0,
        metalness: 0.85,
        roughness: 0.1,
        clearcoat: 1.0
    }),
    'Rose Gold': new THREE.MeshPhysicalMaterial({
        color: 0xDC6D74,
        metalness: 0.8,
        roughness: 0.15,
        clearcoat: 0.9
    }),
    'Stealth Carbon': new THREE.MeshPhysicalMaterial({
        color: 0x2a2a2a,
        metalness: 0.9,
        roughness: 0.2,
        clearcoat: 0.8
    })
};

// Create the basic tourbillon watch structure 
function createTourbillonWatch() {
    const watchGroup = new THREE.Group();
    
    // Main watch case - Titanium Silver base with PBR material
    const caseGeometry = new THREE.CylinderGeometry(2.5, 2.5, 0.3, 64);
    const titaniumMaterial = materials['Titanium Silver'];
    
    const caseMesh = new THREE.Mesh(caseGeometry, titaniumMaterial);
    watchGroup.add(caseMesh);

    // Watch crystal - Glass with reflections
    const crystalGeometry = new THREE.CylinderGeometry(2.6, 2.6, 0.1, 64);
    const crystalMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.9,
        roughness: 0.05,
        clearcoat: 1.0
    });
    
    const crystalMesh = new THREE.Mesh(crystalGeometry, crystalMaterial);
    crystalMesh.position.z = 0.2;
    watchGroup.add(crystalMesh);

    // Tourbillon cage structure with metallic properties
    const frameGeometry = new THREE.RingGeometry(1.8, 2.3, 64);
    const frameMaterial = materials['Titanium Silver'];
    
    const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
    watchGroup.add(frameMesh);

    // Add gear mechanisms inside the cage
    const gear1Geometry = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32);
    const gear2Geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
    
    const gear1Material = materials['Titanium Silver'];
    const gear2Material = materials['Titanium Silver'];
    
    const gear1 = new THREE.Mesh(gear1Geometry, gear1Material);
    gear1.position.z = 0.15;
    watchGroup.add(gear1);
    
    const gear2 = new THREE.Mesh(gear2Geometry, gear2Material);
    gear2.position.z = -0.15;
    watchGroup.add(gear2);

    // Add lume indices
    const lumeIndices = [];
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 2.1;
        
        const lumeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const lumeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff99,
            emissive: 0x00ff99,
            emissiveIntensity: 1
        });
        
        const lume = new THREE.Mesh(lumeGeometry, lumeMaterial);
        lume.position.x = Math.cos(angle) * radius;
        lume.position.y = Math.sin(angle) * radius;
        lume.position.z = 0.2;
        
        watchGroup.add(lume);
        lumeIndices.push(lume);
    }

    // Add skeleton hands
    const hourHandGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1, 8);
    const minuteHandGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8);
    
    const handMaterial = materials['Titanium Silver'];
    
    const hourHand = new THREE.Mesh(hourHandGeometry, handMaterial);
    hourHand.position.z = 0.2;
    watchGroup.add(hourHand);
    
    const minuteHand = new THREE.Mesh(minuteHandGeometry, handMaterial);
    minuteHand.position.z = 0.2;
    watchGroup.add(minuteHand);

    return { 
        watchGroup,
        lumeIndices,
        gear1,
        gear2,
        hourHand,
        minuteHand
    };
}

// Create and add our tourbillon watch to the scene
const watch = createTourbillonWatch();
scene.add(watch.watchGroup);

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

// Mouse parallax tilt effect
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Create floating dust particles in the background
function createDustParticles() {
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        // Create particles in a spherical distribution around the watch
        const radius = 15 + Math.random() * 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        posArray[i] = radius * Math.sin(phi) * Math.cos(theta); // X
        posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta); // Y  
        posArray[i + 2] = radius * Math.cos(phi); // Z
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
}

createDustParticles();

// Animation loop with rotation and parallax effect
function animate() {
    requestAnimationFrame(animate);
    
    // Apply mouse parallax tilt effect 
    if (watch.watchGroup) {
        watch.watchGroup.rotation.y = mouseX * 0.2;  // Y-axis rotation based on mouse
        watch.watchGroup.rotation.x = mouseY * 0.1;  // X-axis rotation based on mouse
    }
    
    // Rotate the watch structure slowly 
    if (watch.watchGroup) {
        watch.watchGroup.rotation.z += 0.005;
    }
    
    // Animate gear mechanisms in opposite directions
    if (watch.gear1) {
        watch.gear1.rotation.y += 0.02;
    }
    if (watch.gear2) {
        watch.gear2.rotation.y -= 0.03;
    }
    
    // Pulsing lume indices
    const time = Date.now() * 0.005;
    watch.lumeIndices.forEach((lume, index) => {
        const pulseIntensity = Math.sin(time + index) * 0.2 + 0.8;
        lume.material.emissive.setHex(0x00ff99);
        lume.material.emissiveIntensity = pulseIntensity;
    });
    
    // Animate skeleton hands
    const now = Date.now() * 0.001;
    if (watch.hourHand) {
        watch.hourHand.rotation.z = (now % 360) * Math.PI / 180; 
    }
    if (watch.minuteHand) {
        watch.minuteHand.rotation.z = (now * 2) % 360 * Math.PI / 180;
    }

    renderer.render(scene, camera);
}

// ScrollTrigger animations for watch rotation and zooming
gsap.from('.scene-container', {
    scrollTrigger: {
        trigger: '.scene-container',
        start: 'top center',
        end: 'bottom top',
        scrub: true,
    },
    rotationY: 360, // Rotate the entire scene on Y axis as we scroll
    scale: 1.2,       // Zoom in slightly during scroll
});

// Dismiss preloader once first frame renders
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        gsap.to(preloader, {
            duration: 0.5,
            opacity: 0,
            pointerEvents: 'none',
            onComplete: () => {
                preloader.style.display = 'none';
            }
        });
    }
});

// Material switching functionality
function switchMaterial(materialType) {
    if (materials[materialType]) {
        // Apply material to watch components
        const materialsArray = [
            watch.watchGroup.children[0], // caseMesh
            watch.watchGroup.children[2], // frameMesh  
            watch.gear1,
            watch.gear2,
            watch.hourHand, 
            watch.minuteHand
        ];
        
        materialsArray.forEach(mesh => {
            if (mesh && mesh.material) {
                mesh.material = materials[materialType];
            }
        });
    }
}

// Expose switchMaterial to global scope for use in app.js
window.switchMaterial = switchMaterial;