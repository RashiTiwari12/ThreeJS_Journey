import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { TextGeometry } from "three/examples/jsm/Addons.js";
import gsap from "gsap";

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/matcaps/3.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;

// ── SCROLL SETUP ─────────────────────────────────────────
document.body.style.height = "300vh";
document.body.style.overflow = "auto";
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";

let allMeshes = []; // all line meshes (for fall reset)
let allLetters = []; // individual letter meshes (for fall effect)
let hasFallen = false;

window.addEventListener("scroll", () => {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progress = window.scrollY / maxScroll;

  // camera scrolls down
  gsap.to(camera.position, {
    y: -progress * 9,
    duration: 1.0,
    ease: "power2.out",
  });

  // at 90%+ scroll — individual letters fall
  if (progress > 0.9 && !hasFallen) {
    hasFallen = true;
    allLetters.forEach((letter) => {
      gsap.to(letter.position, {
        y: letter.position.y - 12 - Math.random() * 8,
        x: letter.position.x + (Math.random() - 0.5) * 6,
        z: letter.position.z + (Math.random() - 0.5) * 4,
        duration: 1.0 + Math.random() * 1.0,
        ease: "power3.in",
        delay: Math.random() * 0.6,
      });
      gsap.to(letter.rotation, {
        x: (Math.random() - 0.5) * Math.PI * 4,
        y: (Math.random() - 0.5) * Math.PI * 4,
        z: (Math.random() - 0.5) * Math.PI * 4,
        duration: 1.5,
        ease: "power2.in",
        delay: Math.random() * 0.6,
      });
    });
  }

  // scrolled back up — reset
  if (progress < 0.85 && hasFallen) {
    hasFallen = false;
    allLetters.forEach((letter) => {
      gsap.to(letter.position, {
        y: letter.userData.originalY,
        x: letter.userData.originalX,
        z: letter.userData.originalZ,
        duration: 1.0,
        ease: "power2.out",
        delay: Math.random() * 0.3,
      });
      gsap.to(letter.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.8,
      });
    });
  }
});

const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

  // ── builds individual letter meshes for a string ──────
  // returns array of meshes positioned side by side
  const makeLetters = (text, size = 0.2, bevel = false) => {
    const letterMeshes = [];
    const spacing = size * 0.72;
    const totalWidth = (text.length - 1) * spacing;

    text.split("").forEach((char, i) => {
      if (char === " ") return; // skip spaces, just offset
      const geo = new TextGeometry(char, {
        font,
        size,
        depth: size * 0.25,
        curveSegments: 6,
        bevelEnabled: bevel,
        bevelThickness: 0.02,
        bevelSize: 0.015,
        bevelSegments: 3,
      });
      const mesh = new THREE.Mesh(geo, material);
      // position each letter manually
      mesh.position.x = i * spacing - totalWidth / 2;
      letterMeshes.push({ mesh, charIndex: i });
    });

    return letterMeshes;
  };

  // ── adds a line of letters to scene with stagger animation ──
  const addLine = (text, yTarget, size = 0.2, bevel = false, baseDelay = 0) => {
    const letters = makeLetters(text, size, bevel);
    letters.forEach(({ mesh }, i) => {
      mesh.position.y = yTarget - 4; // start below
      mesh.position.z = 0;
      mesh.userData.originalY = yTarget;
      mesh.userData.originalX = mesh.position.x;
      mesh.userData.originalZ = 0;

      scene.add(mesh);
      allLetters.push(mesh);

      // stagger each letter coming up
      gsap.to(mesh.position, {
        y: yTarget,
        duration: 2.0,
        delay: baseDelay + i * 0.04,
        ease: "power3.out",
      });
    });
  };

  // ── PAGE 1: ABOUT ─────────────────────────── visible on load
  addLine("About Me", 1.5, 0.5, true, 0.1);
  addLine("Hi, I am Rashi Tiwari", 0.7, 0.18, false, 0.4);
  addLine("Aspiring full-stack developer", 0.32, 0.16, false, 0.6);
  addLine("focused on scalable web apps,", 0.02, 0.16, false, 0.75);
  addLine("modern frontends, backend APIs", -0.28, 0.16, false, 0.9);
  addLine("and cloud technologies.", -0.58, 0.16, false, 1.05);

  // ── PAGE 2: SKILLS ─────────────────────────── scroll to see
  addLine("Skills", -2.5, 0.45, true, 0.1);

  addLine("Languages & Databases", -3.2, 0.22, true, 0.15);
  addLine("HTML  CSS  JavaScript", -3.6, 0.16, false, 0.2);
  addLine("Python  Node.js  MongoDB", -3.9, 0.16, false, 0.25);

  addLine("Libraries & Frameworks", -4.5, 0.22, true, 0.15);
  addLine("ReactJS  Redux-Toolkit  GSAP", -4.9, 0.16, false, 0.2);
  addLine("Tailwind CSS  Material UI", -5.2, 0.16, false, 0.25);
  addLine("Framer Motion  Three.JS", -5.5, 0.16, false, 0.3);

  addLine("CI/CD & Cloud", -6.1, 0.22, true, 0.15);
  addLine("AWS  Github  Github Actions", -6.5, 0.16, false, 0.2);
  addLine("Vercel  Netlify  Postman", -6.8, 0.16, false, 0.25);

  addLine("Certificates", -7.3, 0.22, true, 0.15);
  addLine("AWS Cloud Practitioner", -7.7, 0.16, false, 0.2);
  addLine("+ more coming soon", -8.0, 0.14, false, 0.25);

  // ── PAGE 3: CONTACT ─────────────────────────── bottom
  addLine("Contact", -8.8, 0.45, true, 0.1);
  addLine("LinkedIn: linkedin.com/in/rashitiwari", -9.4, 0.15, false, 0.2);
  addLine("GitHub:   github.com/RashiTiwari12", -9.8, 0.15, false, 0.3);
  addLine("Blender:  sketchfab.com/rashitiwari", -10.2, 0.15, false, 0.4);
});

// ── SIZES ────────────────────────────────────────────────
const sizes = { width: window.innerWidth, height: window.innerHeight };
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

// ── CAMERA ───────────────────────────────────────────────
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.z = 5;
camera.position.y = 0;
scene.add(camera);

// ── CONTROLS ─────────────────────────────────────────────
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = true;

// ── RENDERER ─────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ── ANIMATE ──────────────────────────────────────────────
const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
