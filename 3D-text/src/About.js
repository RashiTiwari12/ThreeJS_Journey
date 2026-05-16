import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { TextGeometry } from "three/examples/jsm/Addons.js";

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/matcaps/3.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;

const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

  // --- Title ---
  const titleGeo = new TextGeometry("About Me", {
    font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelSegments: 5,
  });
  titleGeo.center();
  const title = new THREE.Mesh(titleGeo, material);
  title.position.y = 1.5;
  scene.add(title);

  // --- Body text lines ---
  const lines = [
    "Hi, I am Rashi Tiwari",
    "I am a developer",
    "I love Three.js",
  ];

  lines.forEach((line, i) => {
    const geo = new TextGeometry(line, {
      font,
      size: 0.2,
      depth: 0.05,
      curveSegments: 6,
      bevelEnabled: false,
    });
    geo.center();
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.y = 0.5 - i * 0.4; // stack lines vertically
    scene.add(mesh);
  });
});

// Sizes
const sizes = { width: window.innerWidth, height: window.innerHeight };

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.z = 5;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
