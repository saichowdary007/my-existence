// Three.js setup for 3D cubes
document.addEventListener('DOMContentLoaded', () => {
    const canvases = document.querySelectorAll('.three-canvas');
    canvases.forEach(canvas => {
        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / 200, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(canvas.clientWidth, 200);

        // Cube
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00b4d8, wireframe: true });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // Point Light for glow effect
        const light = new THREE.PointLight(0x00b4d8, 1, 100);
        light.position.set(5, 5, 5);
        scene.add(light);

        // Position camera
        camera.position.z = 2;

        // Animation variables
        let rotationSpeed = 0.01;
        let isHovered = false;

        // Animate
        function animate() {
            requestAnimationFrame(animate);
            cube.rotation.x += rotationSpeed;
            cube.rotation.y += rotationSpeed;
            renderer.render(scene, camera);
        }
        animate();

        // Hover interaction
        canvas.addEventListener('mouseenter', () => {
            isHovered = true;
            rotationSpeed = 0.05; // Speed up on hover
            material.color.setHex(0x00ffff); // Brighter cyan
        });

        canvas.addEventListener('mouseleave', () => {
            isHovered = false;
            rotationSpeed = 0.01; // Slow down
            material.color.setHex(0x00b4d8); // Original color
        });

        // Resize handler
        window.addEventListener('resize', () => {
            renderer.setSize(canvas.clientWidth, 200);
            camera.aspect = canvas.clientWidth / 200;
            camera.updateProjectionMatrix();
        });
    });
});

// Button click alert
document.getElementById('learnMoreBtn').addEventListener('click', () => {
    alert('Ready to explore the universe with AI?');
});

// Smooth scroll for navigation
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        section.scrollIntoView({ behavior: 'smooth' });
    });
});
