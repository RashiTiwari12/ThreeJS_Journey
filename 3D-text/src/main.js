import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { TextGeometry } from "three/examples/jsm/Addons.js";

const gui = new GUI();
/**
 * Canvas
 */
const canvas = document.querySelector("canvas.webgl");

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Object
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load(
  "/matcaps/3.png",
  (tex) => console.log("✅ Texture loaded:", tex), // success
  undefined,
  (err) => console.error("❌ Texture error:", err), // failure
);
matcapTexture.colorSpace = THREE.SRGBColorSpace;
console.log(matcapTexture);
let spheres = [];
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const material = new THREE.MeshMatcapMaterial();
  material.matcap = matcapTexture;
  console.log(font);
  const textGeometry = new TextGeometry("Rashi Tiwari", {
    font: font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  // const material = new THREE.MeshMatcapMaterial();
  // material.matcap = matcapTexture;
  // const material = new THREE.MeshNormalMaterial();
  const mesh = new THREE.Mesh(textGeometry, material);
  textGeometry.center();
  scene.add(mesh);
  const sphereGeometry = new THREE.SphereGeometry(0.3, 16, 16);
  //   const donutMaterial = new THREE.MeshMatcapMaterial();

  for (let i = 0; i < 100; i++) {
    // material.matcap = matcapTexture;
    const bubble = new THREE.Mesh(sphereGeometry, material);
    scene.add(bubble);

    bubble.position.x = (Math.random() - 0.5) * 10;
    bubble.position.y = (Math.random() - 0.5) * 10;
    bubble.position.z = (Math.random() - 0.5) * 10;

    bubble.rotation.x = Math.random() * Math.PI;
    bubble.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    bubble.scale.set(scale, scale, scale);

    // ← add these two lines
    bubble.userData.speed = Math.random() * 0.5 + 0.1;
    bubble.userData.offset = Math.random() * Math.PI * 2;

    spheres.push(bubble);
  }
});
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);

camera.position.z = 3;
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Resize
 */
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
const clock = new THREE.Clock();
/**
 * Animate
 */
const tick = () => {
  const elapsed = clock.getElapsedTime();
  spheres.forEach((sphere) => {
    // spin
    sphere.rotation.x += 0.03 * sphere.userData.speed;
    sphere.rotation.y += 0.005 * sphere.userData.speed;

    // float up and down
    sphere.position.y += Math.sin(elapsed + sphere.userData.offset) * 0.002;

    // drift sideways
    sphere.position.x +=
      Math.cos(elapsed * 0.5 + sphere.userData.offset) * 0.001;
  });

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
