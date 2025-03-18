// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

// Skybox
const skyboxGeometry = new THREE.SphereGeometry(500, 32, 32);
const skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x0a0a23, side: THREE.BackSide });
const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
scene.add(skybox);

// Floating Platforms (Simplified)
const platformGeometry = new THREE.PlaneGeometry(10, 10);
const platformMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 });
for (let i = 0; i < 5; i++) {
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.set(Math.random() * 20 - 10, Math.random() * 5, Math.random() * 20 - 10);
    platform.rotation.x = -Math.PI / 2;
    scene.add(platform);
}

// Audio Setup
const listener = new THREE.AudioListener();
camera.add(listener);
const ambientSound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load('/assets/ambient.mp3', (buffer) => {
    ambientSound.setBuffer(buffer);
    ambientSound.setLoop(true);
    ambientSound.setVolume(0.5);
    ambientSound.play();
});

// Motorcycle Setup
let motorcycle;
const loader = new THREE.GLTFLoader();
const loadingDiv = document.getElementById('loading');
loadingDiv.classList.remove('hidden');
loader.load('/assets/motorcycle.glb', (gltf) => {
    motorcycle = gltf.scene;
    motorcycle.scale.set(0.5, 0.5, 0.5);
    scene.add(motorcycle);
    loadingDiv.classList.add('hidden');
}, undefined, (error) => console.error(error));

// Headlight
const headlight = new THREE.SpotLight(0xffffff, 1, 10, Math.PI / 6);
headlight.position.set(0, 0.5, 1);
motorcycle && motorcycle.add(headlight);

// Engine Sound
const engineSound = new THREE.Audio(listener);
audioLoader.load('/assets/engine.mp3', (buffer) => {
    engineSound.setBuffer(buffer);
    engineSound.setLoop(true);
    engineSound.setVolume(0.3);
});

// Paths
const paths = {
    projects: new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 0, -10), new THREE.Vector3(20, 0, 0)]),
    education: new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(-10, 0, -10), new THREE.Vector3(-20, 0, 0)]),
    experience: new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -20), new THREE.Vector3(10, 0, -30)])
};

// Interactive Objects with LOD
const projects = [
    { position: paths.projects.getPoint(0.5), title: "Project 1", details: "Innovative app design" },
    { position: paths.projects.getPoint(0.7), title: "Project 2", details: "Web platform" }
];
const education = [{ position: paths.education.getPoint(0.5), title: "BS Computer Science", details: "XYZ University" }];
const experience = [{ position: paths.experience.getPoint(0.5), title: "Software Engineer", details: "ABC Corp" }];

function createInteractiveObject(data) {
    const lod = new THREE.LOD();
    const highDetail = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    const lowDetail = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    lod.addLevel(highDetail, 5);
    lod.addLevel(lowDetail, 20);
    lod.position.copy(data.position);
    lod.userData = data;
    scene.add(lod);
    return lod;
}

const interactiveObjects = [
    ...projects.map(createInteractiveObject),
    ...education.map(createInteractiveObject),
    ...experience.map(createInteractiveObject)
];

// Navigation State
let currentPath = paths.projects;
let fraction = 0;
let autoDrive = false;
let speed = 0.005;
let reduceMotion = false;

// Raycaster
const raycaster = new THREE.Raycaster();
const direction = new THREE.Vector3(0, 0, -1);

// Minimap
const minimapCanvas = document.getElementById('minimap');
const minimapContext = minimapCanvas.getContext('2d');
function updateMinimap() {
    minimapContext.clearRect(0, 0, 150, 150);
    minimapContext.fillStyle = 'white';
    minimapContext.fillRect((fraction * 140) + 5, 70, 5, 5);
    requestAnimationFrame(updateMinimap);
}
updateMinimap();

// UI Event Listeners
document.getElementById('start').addEventListener('click', () => {
    fraction = 0;
    autoDrive = true;
});

document.getElementById('customize').addEventListener('click', () => {
    if (!motorcycle) return;
    const color = prompt("Enter color (e.g., #ff0000):", "#ff0000");
    motorcycle.traverse((child) => {
        if (child.isMesh) child.material.color.set(color);
    });
});

document.getElementById('toggleMode').addEventListener('click', () => {
    autoDrive = !autoDrive;
});

document.getElementById('settings').addEventListener('click', () => {
    document.getElementById('settings-menu').classList.toggle('hidden');
});

document.getElementById('closeSettings').addEventListener('click', () => {
    document.getElementById('settings-menu').classList.add('hidden');
});

document.getElementById('highContrast').addEventListener('change', (e) => {
    document.body.classList.toggle('high-contrast', e.target.checked);
});

document.getElementById('reduceMotion').addEventListener('change', (e) => {
    reduceMotion = e.target.checked;
});

// Manual Controls
document.addEventListener('keydown', (event) => {
    if (!autoDrive) {
        switch (event.key) {
            case 'ArrowUp': fraction = Math.min(fraction + speed, 1); break;
            case 'ArrowDown': fraction = Math.max(fraction - speed, 0); break;
            case '1': currentPath = paths.projects; fraction = 0; break;
            case '2': currentPath = paths.education; fraction = 0; break;
            case '3': currentPath = paths.experience; fraction = 0; break;
        }
    }
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    if (!motorcycle) return;

    // Update Motorcycle
    if (autoDrive) fraction = Math.min(fraction + speed, 1);
    const position = currentPath.getPoint(fraction);
    motorcycle.position.copy(position);
    const tangent = currentPath.getTangent(fraction);
    motorcycle.lookAt(position.clone().add(tangent));
    engineSound.setVolume(autoDrive || fraction > 0 ? 0.3 : 0);
    if (!engineSound.isPlaying && (autoDrive || fraction > 0)) engineSound.play();

    // Update Camera
    const targetCameraPos = position.clone().add(new THREE.Vector3(0, 5, 10));
    if (reduceMotion) camera.position.copy(targetCameraPos);
    else camera.position.lerp(targetCameraPos, 0.1);
    camera.lookAt(motorcycle.position);

    // Headlight Interaction
    raycaster.set(motorcycle.position, direction.clone().applyQuaternion(motorcycle.quaternion));
    const intersects = raycaster.intersectObjects(interactiveObjects.map(o => o.children[0]));
    if (intersects.length > 0) {
        const obj = intersects[0].object.parent;
        obj.scale.set(1.5, 1.5, 1.5);
        if (intersects[0].distance < 5) console.log(obj.userData); // Replace with popup
    }
    interactiveObjects.forEach(obj => {
        if (!intersects.some(i => i.object.parent === obj)) obj.scale.set(1, 1, 1);
    });

    renderer.render(scene, camera);
}
animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
