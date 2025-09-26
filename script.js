/*import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- Scene Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
 
// Fog and Background
scene.background = new THREE.Color(0x0a0a0a);
scene.fog = new THREE.Fog(0x0a0a0a, 1, 30);

// --- Environment Creation ---
// Floating platform
const floorGeometry = new THREE.CylinderGeometry(15, 15, 0.5, 64);
const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x1c1c1c });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.25;
scene.add(floor);

// Central light column
const columnGeometry = new THREE.CylinderGeometry(1, 1, 10, 32);
const columnMaterial = new THREE.MeshBasicMaterial({ color: 0x444444, wireframe: true });
const column = new THREE.Mesh(columnGeometry, columnMaterial);
column.position.y = 5;
scene.add(column);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xd1b36e, 1.5, 100);
pointLight.position.set(0, 8, 0);
scene.add(pointLight);

// Colored spotlights for atmosphere
const blueLight = new THREE.SpotLight(0x00aaff, 1, 50, Math.PI / 8);
blueLight.position.set(-10, 5, -10);
scene.add(blueLight);

const pinkLight = new THREE.SpotLight(0xff00e5, 1, 50, Math.PI / 8);
pinkLight.position.set(10, 5, 10);
scene.add(pinkLight);

// --- Artwork Data ---
const artworks = [
    {
        title: "Whispers of the Cosmos",
        artist: "Alex Ray",
        description: "A vibrant composition of swirling forms and deep colors, capturing the unseen energies of the universe.",
        image: "art1.jpg",
        position: new THREE.Vector3(0, 1.6, -10),
        rotation: new THREE.Vector3(0, 0, 0),
    },
    {
        title: "Morning Mist",
        artist: "Alex Ray",
        description: "Delicate washes of blue and green evoke the tranquil feeling of a misty morning by the lake.",
        image: "art2.jpg",
        position: new THREE.Vector3(-10, 1.6, 0),
        rotation: new THREE.Vector3(0, Math.PI / 2, 0),
    },
    {
        title: "Cyberpunk Alley",
        artist: "Alex Ray",
        description: "A detailed digital painting of a futuristic street, bathed in the glow of neon signs and rain-slicked asphalt.",
        image: "art3.jpg",
        position: new THREE.Vector3(10, 1.6, 0),
        rotation: new THREE.Vector3(0, -Math.PI / 2, 0),
    },
    {
        title: "Fractal Dreams",
        artist: "Alex Ray",
        description: "Intricate patterns and a chaotic yet harmonious blend of colors that represent the subconscious mind.",
        image: "art4.jpg",
        position: new THREE.Vector3(0, 1.6, 10),
        rotation: new THREE.Vector3(0, Math.PI, 0),
    },
    
    {
        title: "Bio-Mechanical Flora",
        artist: "Alex Ray",
        description: "A unique piece combining organic plant life with cold, industrial mechanical elements.",
        image: "art6.jpg",
        position: new THREE.Vector3(-7, 1.6, 7),
        rotation: new THREE.Vector3(0, -Math.PI / 4, 0),
    }
];

const artworkObjects = [];
const loader = new THREE.TextureLoader();

// Create and position artwork planes
artworks.forEach(art => {
    loader.load(art.image, texture => {
        const material = new THREE.MeshStandardMaterial({ map: texture, emissive: 0x000000, emissiveIntensity: 0.5 });
        const geometry = new THREE.PlaneGeometry(3.5, 2.5);
        const plane = new THREE.Mesh(geometry, material);
        plane.position.copy(art.position);
        plane.rotation.set(art.rotation.x, art.rotation.y, art.rotation.z);
        plane.userData = art; // Store artwork data on the mesh
        scene.add(plane);
        artworkObjects.push(plane);
    });
});

// --- Controls and Raycaster ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.minDistance = 2;
controls.maxDistance = 15;
controls.target.set(0, 1.6, 0);
controls.update();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isModalOpen = false;
let hoveredObject = null;

// Handle mouse movement for hover effect
window.addEventListener('mousemove', onMouseMove, false);
function onMouseMove(event) {
    if (isModalOpen) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(artworkObjects);

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (hoveredObject !== intersectedObject) {
            if (hoveredObject) {
                hoveredObject.material.emissive.setHex(0x000000);
                hoveredObject.scale.set(1, 1, 1);
            }
            hoveredObject = intersectedObject;
            hoveredObject.material.emissive.setHex(0xd1b36e);
            hoveredObject.scale.set(1.05, 1.05, 1.05);
        }
    } else {
        if (hoveredObject) {
            hoveredObject.material.emissive.setHex(0x000000);
            hoveredObject.scale.set(1, 1, 1);
        }
        hoveredObject = null;
    }
}

// Handle click for modal
window.addEventListener('click', onMouseClick, false);
function onMouseClick(event) {
    if (isModalOpen) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(artworkObjects);

    if (intersects.length > 0) {
        const artworkData = intersects[0].object.userData;
        displayArtworkDetails(artworkData);
    }
}

// --- UI and Modal Logic ---
const modal = document.getElementById('artwork-modal');
const modalTitle = document.getElementById('modal-title');
const modalArtist = document.getElementById('modal-artist');
const modalImage = document.getElementById('modal-image');
const modalDescription = document.getElementById('modal-description');
const closeModalBtn = document.getElementById('close-modal');

function displayArtworkDetails(data) {
    modalTitle.innerText = data.title;
    modalArtist.innerText = `By: ${data.artist}`;
    modalImage.src = data.image;
    modalDescription.innerText = data.description;
    modal.style.display = 'flex';
    isModalOpen = true;
}

closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    isModalOpen = false;
});

// --- Audio Logic ---
const audioButton = document.getElementById('audio-button');
let isPlaying = false;
const synth = new Tone.PolySynth(Tone.Synth).toDestination();

const playAmbientSound = () => {
    const now = Tone.now();
    // A simple, ambient synth arpeggiation
    synth.triggerAttackRelease("C4", "8n", now);
    synth.triggerAttackRelease("E4", "8n", now + 0.25);
    synth.triggerAttackRelease("G4", "8n", now + 0.5);
    synth.triggerAttackRelease("B4", "8n", now + 0.75);
};

const loop = new Tone.Loop(playAmbientSound, "1n").start(0);

audioButton.addEventListener('click', () => {
    if (!isPlaying) {
        Tone.start();
        Tone.Transport.start();
        audioButton.innerText = "Pause Audio";
    } else {
        Tone.Transport.stop();
        audioButton.innerText = "Play Audio";
    }
    isPlaying = !isPlaying;
});

// --- Guided Tour Logic ---
const tourButton = document.getElementById('tour-button');
let tourActive = false;
const tourPoints = artworks.map(art => art.position.clone().add(new THREE.Vector3(0, 0, 3)));
let currentTourPoint = 0;
 
tourButton.addEventListener('click', () => {
    tourActive = !tourActive;
    if (tourActive) {
        tourButton.innerText = "Stop Tour";
        startTour();
    } else {
        tourButton.innerText = "Guided Tour";
    }
});

function startTour() {
    if (!tourActive) return;

    const targetPosition = tourPoints[currentTourPoint];
    const initialPosition = camera.position.clone();
     
    new TWEEN.Tween(initialPosition)
        .to(targetPosition, 3000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            camera.position.copy(initialPosition);
            controls.target.copy(artworkObjects[currentTourPoint].position);
            controls.update();
        })
        .onComplete(() => {
            currentTourPoint = (currentTourPoint + 1) % tourPoints.length;
            setTimeout(startTour, 1000); // Pause for a second at each artwork
        })
        .start();
}

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});*/
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- Scene Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
 
// Fog and Background
scene.background = new THREE.Color(0x0a0a0a);
scene.fog = new THREE.Fog(0x0a0a0a, 1, 30);

// --- Environment Creation ---
// Floating platform
const floorGeometry = new THREE.CylinderGeometry(15, 15, 0.5, 64);
const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x1c1c1c });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.25;
scene.add(floor);

// Central light column
const columnGeometry = new THREE.CylinderGeometry(1, 1, 10, 32);
const columnMaterial = new THREE.MeshBasicMaterial({ color: 0x444444, wireframe: true });
const column = new THREE.Mesh(columnGeometry, columnMaterial);
column.position.y = 5;
scene.add(column);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xd1b36e, 1.5, 100);
pointLight.position.set(0, 8, 0);
scene.add(pointLight);

// Colored spotlights for atmosphere
const blueLight = new THREE.SpotLight(0x00aaff, 1, 50, Math.PI / 8);
blueLight.position.set(-10, 5, -10);
scene.add(blueLight);

const pinkLight = new THREE.SpotLight(0xff00e5, 1, 50, Math.PI / 8);
pinkLight.position.set(10, 5, 10);
scene.add(pinkLight);

// --- Artwork Data ---
const artworks = [
    {
        title: "Whispers of the Cosmos",
        artist: "Alex Ray",
        description: "A vibrant composition of swirling forms and deep colors, capturing the unseen energies of the universe.",
        image: "art1.jpg",
        position: new THREE.Vector3(0, 1.6, -10),
        rotation: new THREE.Vector3(0, 0, 0),
    },
    {
        title: "Morning Mist",
        artist: "Alex Ray",
        description: "Delicate washes of blue and green evoke the tranquil feeling of a misty morning by the lake.",
        image: "art2.jpg",
        position: new THREE.Vector3(-10, 1.6, 0),
        rotation: new THREE.Vector3(0, Math.PI / 2, 0),
    },
    {
        title: "Cyberpunk Alley",
        artist: "Alex Ray",
        description: "A detailed digital painting of a futuristic street, bathed in the glow of neon signs and rain-slicked asphalt.",
        image: "art3.jpg",
        position: new THREE.Vector3(10, 1.6, 0),
        rotation: new THREE.Vector3(0, -Math.PI / 2, 0),
    },
    {
        title: "Fractal Dreams",
        artist: "Alex Ray",
        description: "Intricate patterns and a chaotic yet harmonious blend of colors that represent the subconscious mind.",
        image: "art4.jpg",
        position: new THREE.Vector3(0, 1.6, 10),
        rotation: new THREE.Vector3(0, Math.PI, 0),
    },
    {
        title: "Bio-Mechanical Flora",
        artist: "Alex Ray",
        description: "A unique piece combining organic plant life with cold, industrial mechanical elements.",
        image: "art6.jpg",
        position: new THREE.Vector3(-7, 1.6, 7),
        rotation: new THREE.Vector3(0, -Math.PI / 4, 0),
    }
];

const artworkObjects = [];
const loader = new THREE.TextureLoader();

// Create and position artwork planes
artworks.forEach(art => {
    loader.load(art.image, texture => {
        const material = new THREE.MeshStandardMaterial({ map: texture, emissive: 0x000000, emissiveIntensity: 0.5 });
        const geometry = new THREE.PlaneGeometry(3.5, 2.5);
        const plane = new THREE.Mesh(geometry, material);
        plane.position.copy(art.position);
        plane.rotation.set(art.rotation.x, art.rotation.y, art.rotation.z);
        plane.userData = art; // Store artwork data on the mesh
        scene.add(plane);
        artworkObjects.push(plane);
    });
});

// --- Controls and Raycaster ---
// Use OrbitControls, as it now supports touch by default, but we'll add custom logic for interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.minDistance = 2;
controls.maxDistance = 15;
controls.target.set(0, 1.6, 0);
controls.update();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isModalOpen = false;
let hoveredObject = null;
let isMobile = /Mobi|Android/i.test(navigator.userAgent);

function onPointerMove(event) {
    if (isModalOpen) return;

    // Use touch or mouse coordinates
    if (event.touches) {
        mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    } else {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(artworkObjects);

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (hoveredObject !== intersectedObject) {
            if (hoveredObject) {
                hoveredObject.material.emissive.setHex(0x000000);
                hoveredObject.scale.set(1, 1, 1);
            }
            hoveredObject = intersectedObject;
            hoveredObject.material.emissive.setHex(0xd1b36e);
            hoveredObject.scale.set(1.05, 1.05, 1.05);
        }
    } else {
        if (hoveredObject) {
            hoveredObject.material.emissive.setHex(0x000000);
            hoveredObject.scale.set(1, 1, 1);
        }
        hoveredObject = null;
    }
}

// Handle pointer down (touch or mouse) for modal
function onPointerDown(event) {
    if (isModalOpen) return;

    // Use touch or mouse coordinates
    if (event.touches) {
        mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    } else {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(artworkObjects);

    if (intersects.length > 0) {
        // Prevent OrbitControls from moving the camera when an artwork is tapped
        controls.enabled = false;
        const artworkData = intersects[0].object.userData;
        displayArtworkDetails(artworkData);
    } else {
        // Re-enable controls if the user is not clicking an artwork
        controls.enabled = true;
    }
}

// Attach event listeners for both mouse and touch
window.addEventListener('pointermove', onPointerMove, false);
window.addEventListener('pointerdown', onPointerDown, false);

// --- UI and Modal Logic ---
const modal = document.getElementById('artwork-modal');
const modalTitle = document.getElementById('modal-title');
const modalArtist = document.getElementById('modal-artist');
const modalImage = document.getElementById('modal-image');
const modalDescription = document.getElementById('modal-description');
const closeModalBtn = document.getElementById('close-modal');

function displayArtworkDetails(data) {
    modalTitle.innerText = data.title;
    modalArtist.innerText = `By: ${data.artist}`;
    modalImage.src = data.image;
    modalDescription.innerText = data.description;
    modal.style.display = 'flex';
    isModalOpen = true;
    controls.enabled = false; // Disable controls when modal is open
}

closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    isModalOpen = false;
    controls.enabled = true; // Re-enable controls when modal is closed
});

// --- Audio Logic ---
const audioButton = document.getElementById('audio-button');
let isPlaying = false;
const synth = new Tone.PolySynth(Tone.Synth).toDestination();

const playAmbientSound = () => {
    const now = Tone.now();
    synth.triggerAttackRelease("C4", "8n", now);
    synth.triggerAttackRelease("E4", "8n", now + 0.25);
    synth.triggerAttackRelease("G4", "8n", now + 0.5);
    synth.triggerAttackRelease("B4", "8n", now + 0.75);
};

const loop = new Tone.Loop(playAmbientSound, "1n").start(0);

audioButton.addEventListener('click', () => {
    if (!isPlaying) {
        Tone.start();
        Tone.Transport.start();
        audioButton.innerText = "Pause Audio";
    } else {
        Tone.Transport.stop();
        audioButton.innerText = "Play Audio";
    }
    isPlaying = !isPlaying;
});

// --- Guided Tour Logic ---
const tourButton = document.getElementById('tour-button');
let tourActive = false;
const tourPoints = artworks.map(art => art.position.clone().add(new THREE.Vector3(0, 0, 3)));
let currentTourPoint = 0;
 
tourButton.addEventListener('click', () => {
    tourActive = !tourActive;
    if (tourActive) {
        tourButton.innerText = "Stop Tour";
        startTour();
        controls.enabled = false; // Disable controls during tour
    } else {
        tourButton.innerText = "Guided Tour";
        controls.enabled = true; // Re-enable controls after tour
    }
});

function startTour() {
    if (!tourActive) return;

    const targetPosition = tourPoints[currentTourPoint];
    const initialPosition = camera.position.clone();
     
    new TWEEN.Tween(initialPosition)
        .to(targetPosition, 3000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            camera.position.copy(initialPosition);
            controls.target.copy(artworkObjects[currentTourPoint].position);
            controls.update();
        })
        .onComplete(() => {
            currentTourPoint = (currentTourPoint + 1) % tourPoints.length;
            if (tourActive) {
                setTimeout(startTour, 1000);
            }
        })
        .start();
}

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});