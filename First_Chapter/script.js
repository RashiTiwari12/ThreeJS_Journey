import * as Three from "three";

const canvas = document.querySelector("canvas.webgl");
//Scene
const scene = new Three.Scene();

//Object
const geometry = new Three.BoxGeometry(1, 1, 1);
const material = new Three.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new Three.Mesh(geometry, material);
mesh.position.y = 0.7;
// mesh.scale.y = 2;
mesh.scale.set(1, 2, 1);

//rotation
mesh.rotation.y = 1;
mesh.rotation.reorder("YXZ");
mesh.rotation.x = Math.PI * 0.25;

scene.add(mesh);

//axes helper
const axesHelper = new Three.AxesHelper(5);
scene.add(axesHelper);
//Sizes
const sizes = {
  width: 800,
  height: 600,
};
//Camera
const camera = new Three.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);
console.log(mesh.position.distanceTo(camera.position));

//lookAt
camera.lookAt(mesh.position);
camera.lookAt(new Three.Vector3(0, 0, 3));

//group
const group = new Three.Group();
group.position.y = 1;

scene.add(group);
const cube1 = new Three.Mesh(
  new Three.BoxGeometry(1, 1, 1),
  new Three.MeshBasicMaterial({ color: 0xff0000 }),
);
group.add(cube1);
const cube2 = new Three.Mesh(
  new Three.BoxGeometry(1, 1, 1),
  new Three.MeshBasicMaterial({ color: 0x00ff00 }),
);
cube2.position.x = 2;
group.add(cube2);
const cube3 = new Three.Mesh(
  new Three.BoxGeometry(1, 1, 1),
  new Three.MeshBasicMaterial({ color: 0x0000ff }),
);
cube3.position.x = -2;
group.add(cube3);
//Renderer
const renderer = new Three.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
