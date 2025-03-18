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

// Motorcycle Setup (Fallback: Simple Box)
const motorcycleGeometry = new THREE.BoxGeometry(1, 0.5, 2);
const motorcycleMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
const motorcycle = new THREE.Mesh(motorcycleGeometry, motorcycleMaterial);
scene.add(motorcycle);

// Check if the loading element exists before trying to modify it
const loadingElement = document.getElementById('loading');
if (loadingElement) {
    loadingElement.classList.add('hidden'); // Hide loading immediately
}

// Headlight
const headlight = new THREE.SpotLight(0xffffff, 1, 10, Math.PI / 6);
headlight.position.set(0, 0.5, 1);
motorcycle.add(headlight);

// Paths
const paths = {
    projects: new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0), 
        new THREE.Vector3(10, 0, -10), 
        new THREE.Vector3(20, 0, 0)
    ]),
    education: new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0), 
        new THREE.Vector3(-10, 0, -10), 
        new THREE.Vector3(-20, 0, 0)
    ]),
    experience: new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0), 
        new THREE.Vector3(0, 0, -20), 
        new THREE.Vector3(10, 0, -30)
    ])
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
    const highDetail = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32), 
        new THREE.MeshPhongMaterial({ color: 0x00ff00 })
    );
    const lowDetail = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 8, 8), 
        new THREE.MeshPhongMaterial({ color: 0x00ff00 })
    );
    lod.addLevel(highDetail, 0);  // Corrected distance (0 for highest detail)
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
if (minimapCanvas) {
    const minimapContext = minimapCanvas.getContext('2d');
    
    function updateMinimap() {
        minimapContext.clearRect(0, 0, 150, 150);
        minimapContext.fillStyle = 'white';
        minimapContext.fillRect((fraction * 140) + 5, 70, 5, 5);
        requestAnimationFrame(updateMinimap);
    }
    updateMinimap();
}

// UI Event Listeners
const startButton = document.getElementById('start');
if (startButton) {
    startButton.addEventListener('click', () => {
        fraction = 0;
        autoDrive = true;
    });
}

const customizeButton = document.getElementById('customize');
if (customizeButton) {
    customizeButton.addEventListener('click', () => {
        const color = prompt("Enter color (e.g., #ff0000):", "#ff0000");
        if (color) {
            motorcycleMaterial.color.set(color);
        }
    });
}

const toggleModeButton = document.getElementById('toggleMode');
if (toggleModeButton) {
    toggleModeButton.addEventListener('click', () => {
        autoDrive = !autoDrive;
    });
}

const settingsButton = document.getElementById('settings');
const settingsMenu = document.getElementById('settings-menu');
if (settingsButton && settingsMenu) {
    settingsButton.addEventListener('click', () => {
        settingsMenu.classList.toggle('hidden');
    });
}

const closeSettingsButton = document.getElementById('closeSettings');
if (closeSettingsButton && settingsMenu) {
    closeSettingsButton.addEventListener('click', () => {
        settingsMenu.classList.add('hidden');
    });
}

const highContrastCheckbox = document.getElementById('highContrast');
if (highContrastCheckbox) {
    highContrastCheckbox.addEventListener('change', (e) => {
        document.body.classList.toggle('high-contrast', e.target.checked);
    });
}

const reduceMotionCheckbox = document.getElementById('reduceMotion');
if (reduceMotionCheckbox) {
    reduceMotionCheckbox.addEventListener('change', (e) => {
        reduceMotion = e.target.checked;
    });
}

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

    // Update Motorcycle
    if (autoDrive) fraction = Math.min(fraction + speed, 1);
    const position = currentPath.getPoint(fraction);
    motorcycle.position.copy(position);
    const tangent = currentPath.getTangent(fraction);
    motorcycle.lookAt(position.clone().add(tangent));

    // Update Camera
    const targetCameraPos = position.clone().add(new THREE.Vector3(0, 5, 10));
    if (reduceMotion) {
        camera.position.copy(targetCameraPos);
    } else {
        camera.position.lerp(targetCameraPos, 0.1);
    }
    camera.lookAt(motorcycle.position);

    // Headlight Interaction
    raycaster.set(motorcycle.position, direction.clone().applyQuaternion(motorcycle.quaternion));
    
    // Create a function to get all meshes from LOD objects
    const getAllChildMeshes = (obj) => {
        const children = [];
        obj.children.forEach(child => {
            if (child instanceof THREE.Mesh) {
                children.push(child);
            }
        });
        return children;
    };
    
    // Collect all meshes from LOD objects for raycasting
    const interactiveMeshes = [];
    interactiveObjects.forEach(obj => {
        interactiveMeshes.push(...getAllChildMeshes(obj));
    });
    
    const intersects = raycaster.intersectObjects(interactiveMeshes);
    
    // Reset all object scales first
    interactiveObjects.forEach(obj => {
        obj.scale.set(1, 1, 1);
    });
    
    if (intersects.length > 0) {
        // Find parent LOD for the intersected mesh
        const hitMesh = intersects[0].object;
        const hitLOD = interactiveObjects.find(obj => 
            obj.children.indexOf(hitMesh) !== -1
        );
        
        if (hitLOD) {
            hitLOD.scale.set(1.5, 1.5, 1.5);
            if (intersects[0].distance < 5) {
                console.log(hitLOD.userData); // Replace with popup
            }
        }
    }

    renderer.render(scene, camera);
}
animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
