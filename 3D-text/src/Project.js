import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { TextGeometry } from "three/examples/jsm/Addons.js";

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/matcaps/3.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;

// ── RAYCASTER ─────────────────────────────────────────────
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const linkMap = new Map(); // mesh → url

const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

  // --- Title --- (unchanged)
  const titleGeo = new TextGeometry("Projects", {
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

  // --- Project data with URLs ---
  const projectData = [
    {
      label: "Project 1: Tia's Park",
      url: "https://tia-s-park-z4m3.vercel.app/",
    },
    { label: "Project 2: Shoplane", url: "https://shoplane-e.netlify.app/" },
    { label: "Project 3: Fleur Clone", url: "https://fleur-clone.vercel.app/" },
    {
      label: "Project 4: Pizza Joint",
      url: "https://pizza-joint-zeta.vercel.app/",
    },
    {
      label: "Project 5: Shop Space",
      url: "https://shop-space-management.onrender.com/",
    },
    {
      label: "Project 6: Movie Ticket",
      url: "https://github.com/RashiTiwari12/Final-MovieTicket",
    },
  ];

  projectData.forEach(({ label, url }, i) => {
    const geo = new TextGeometry(label, {
      font,
      size: 0.2,
      depth: 0.05,
      curveSegments: 6,
      bevelEnabled: false,
    });
    geo.center();
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.y = 0.5 - i * 0.4; // same as before
    scene.add(mesh);

    // tag mesh with url
    linkMap.set(mesh, url);
  });
});

// Sizes (unchanged)
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

// ── HOVER ─────────────────────────────────────────────────
window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects([...linkMap.keys()]);

  canvas.style.cursor = hits.length > 0 ? "pointer" : "default";

  // reset all scales
  linkMap.forEach((_, mesh) => mesh.scale.set(1, 1, 1));

  // scale up hovered mesh
  if (hits.length > 0) hits[0].object.scale.set(1.1, 1.1, 1.1);
});

// ── CLICK ─────────────────────────────────────────────────
window.addEventListener("click", (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects([...linkMap.keys()]);

  if (hits.length > 0) {
    const url = linkMap.get(hits[0].object);
    window.open(url, "_blank");
  }
});

// ── TICK (unchanged) ──────────────────────────────────────
const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
