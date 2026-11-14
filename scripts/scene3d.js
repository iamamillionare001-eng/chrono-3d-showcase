import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const container = document.getElementById('scene-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2.2, 0.2, 7.5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
keyLight.position.set(4, 6, 5);
scene.add(keyLight);

const goldRimLight = new THREE.DirectionalLight(0xf3d078, 1.4);
goldRimLight.position.set(-5, 3, -3);
scene.add(goldRimLight);

const fillLight = new THREE.DirectionalLight(0x88aaff, 0.9);
fillLight.position.set(0, -5, 4);
scene.add(fillLight);

scene.add(new THREE.AmbientLight(0xffffff, 0.55));

const materials = {
    'Titanium Silver': new THREE.MeshPhysicalMaterial({
        color: 0xd8dce3,
        metalness: 0.88,
        roughness: 0.18,
        clearcoat: 1.0
    }),
    'Rose Gold': new THREE.MeshPhysicalMaterial({
        color: 0xe29578,
        metalness: 0.85,
        roughness: 0.2,
        clearcoat: 0.95
    }),
    'Stealth Carbon': new THREE.MeshPhysicalMaterial({
        color: 0x262830,
        metalness: 0.75,
        roughness: 0.32,
        clearcoat: 0.7
    })
};

function createTourbillonWatch() {
    const watchGroup = new THREE.Group();

    const bezelGeometry = new THREE.TorusGeometry(2.35, 0.24, 32, 80);
    const bezelMesh = new THREE.Mesh(bezelGeometry, materials['Titanium Silver']);
    watchGroup.add(bezelMesh);

    const caseBackGeometry = new THREE.CylinderGeometry(2.35, 2.35, 0.28, 64);
    caseBackGeometry.rotateX(Math.PI / 2);
    const caseBackMaterial = new THREE.MeshStandardMaterial({
        color: 0x101018,
        metalness: 0.8,
        roughness: 0.35
    });
    const caseBackMesh = new THREE.Mesh(caseBackGeometry, caseBackMaterial);
    caseBackMesh.position.z = -0.18;
    watchGroup.add(caseBackMesh);

    const innerRingGeometry = new THREE.RingGeometry(1.65, 2.2, 64);
    const innerRingMesh = new THREE.Mesh(innerRingGeometry, materials['Titanium Silver']);
    innerRingMesh.position.z = 0.02;
    watchGroup.add(innerRingMesh);

    const gear1Geometry = new THREE.TorusGeometry(0.85, 0.08, 16, 48);
    const gear1 = new THREE.Mesh(gear1Geometry, materials['Titanium Silver']);
    gear1.position.set(0, -0.35, 0.08);
    watchGroup.add(gear1);

    const gear2Geometry = new THREE.TorusGeometry(0.55, 0.06, 16, 36);
    const gear2 = new THREE.Mesh(gear2Geometry, materials['Titanium Silver']);
    gear2.position.set(0.35, 0.45, 0.05);
    watchGroup.add(gear2);

    const lumeIndices = [];
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 1.95;
        const lumeGeometry = new THREE.SphereGeometry(0.055, 12, 12);
        const lumeMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffaa,
            emissive: 0x00ffaa,
            emissiveIntensity: 1.2
        });
        const lume = new THREE.Mesh(lumeGeometry, lumeMaterial);
        lume.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.14);
        watchGroup.add(lume);
        lumeIndices.push(lume);
    }

    const hourHandGeometry = new THREE.BoxGeometry(0.08, 1.15, 0.04);
    hourHandGeometry.translate(0, 0.45, 0);
    const hourHand = new THREE.Mesh(hourHandGeometry, materials['Titanium Silver']);
    hourHand.position.z = 0.18;
    watchGroup.add(hourHand);

    const minuteHandGeometry = new THREE.BoxGeometry(0.05, 1.65, 0.04);
    minuteHandGeometry.translate(0, 0.65, 0);
    const minuteHand = new THREE.Mesh(minuteHandGeometry, materials['Titanium Silver']);
    minuteHand.position.z = 0.22;
    watchGroup.add(minuteHand);

    return { watchGroup, bezelMesh, innerRingMesh, lumeIndices, gear1, gear2, hourHand, minuteHand };
}

const watch = createTourbillonWatch();
watch.watchGroup.position.set(1.6, 0, 0);
scene.add(watch.watchGroup);

const particleCount = 700;
const particles = new THREE.BufferGeometry();
const posArray = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 28;
    posArray[i + 1] = (Math.random() - 0.5) * 28;
    posArray[i + 2] = (Math.random() - 0.5) * 18 - 4;
}
particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particleSystem = new THREE.Points(
    particles,
    new THREE.PointsMaterial({ color: 0xf3d078, size: 0.05, transparent: true, opacity: 0.65 })
);
scene.add(particleSystem);

let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

gsap.to(watch.watchGroup.rotation, {
    y: Math.PI * 1.5,
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
    }
});

gsap.to(watch.watchGroup.position, {
    x: 0,
    z: 1.2,
    scrollTrigger: {
        trigger: '.features-section',
        start: 'top bottom',
        end: 'center center',
        scrub: 1
    }
});

let preloaderDismissed = false;

function animate() {
    requestAnimationFrame(animate);

    watch.watchGroup.rotation.x += (mouseY * 0.25 - watch.watchGroup.rotation.x) * 0.06;
    watch.gear1.rotation.z += 0.025;
    watch.gear2.rotation.z -= 0.035;
    particleSystem.rotation.y += 0.0008;

    const time = Date.now() * 0.004;
    watch.lumeIndices.forEach((lume, index) => {
        lume.material.emissiveIntensity = Math.sin(time + index * 0.5) * 0.35 + 1.0;
    });

    const now = Date.now() * 0.0005;
    watch.hourHand.rotation.z = -now * 0.2;
    watch.minuteHand.rotation.z = -now;

    renderer.render(scene, camera);

    if (!preloaderDismissed) {
        preloaderDismissed = true;
        const preloader = document.getElementById('preloader');
        if (preloader) {
            gsap.to(preloader, {
                duration: 0.45,
                opacity: 0,
                onComplete: () => { preloader.style.display = 'none'; }
            });
        }
    }
}

export function switchMaterial(materialType) {
    const targetMat = materials[materialType];
    if (!targetMat) return;
    [watch.bezelMesh, watch.innerRingMesh, watch.gear1, watch.gear2, watch.hourHand, watch.minuteHand].forEach((mesh) => {
        if (mesh) mesh.material = targetMat;
    });
}

window.switchMaterial = switchMaterial;
animate();