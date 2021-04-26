import * as THREE from "./node_modules/three/build/three.module.js";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "./node_modules/three/examples/jsm/loaders/GLTFLoader.js";

function d2r(degrees) {
  // Turn degrees into Radients
  var pi = Math.PI;
  return degrees * (pi / 180);
}

let width = window.innerWidth / 2; // set the value for rendering and camera width, always half of the window size

// Scene + Camera + Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  width / window.innerHeight,
  1,
  900
);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Renderer settings
renderer.setClearColor("#151516"); // Background Color
renderer.setSize(width, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableZoom = false;
controls.minPolarAngle = d2r(98); // I Set the same value for min and max polar angle to disable vertical orbit control
controls.maxPolarAngle = d2r(98); // It can be set between 0 and PI
controls.target.y = 1.7; // moving the focus point up

// Camera settings
camera.position.z = 5;
controls.update();

// Ambient light
var ambientLight = new THREE.AmbientLight(0xff04ff, 0.5);
ambientLight.position.set(0, 50, 0);
scene.add(ambientLight);

// Point light
var pointLight = new THREE.PointLight(0xffffff, 0.9);
pointLight.position.set(30, 5, 40);
scene.add(pointLight);

// Back light
var backLight = new THREE.PointLight(0xff39ff, 1);
backLight.position.set(-70, -5, -50);
scene.add(backLight);

// Resize canvas if the window is resized
window.addEventListener("resize", () => {
  let width = window.innerWidth / 2;
  let height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

// Grid Helper
//const gridHelper = new THREE.GridHelper( 10, 10 );
//scene.add( gridHelper );

// Load the Model
var model;
const loader = new GLTFLoader();
loader.load("./woman/model.glb", function (gltf) {
  gltf.scene.scale.set(0.1, 0.1, 0.1);
  gltf.scene.position.set(0, -0.5, 0);
  gltf.scene.rotation.y = Math.PI; // Turn the model towards the camera
  model = gltf.scene;

  model.traverse((child) => {
    // console.log(child);

    // Deal with left shoulder bone
    if (child.name === "HumanFemale_bone_ShoulderL") {
      console.log(child);
      child.scale.set(2, 2, 2);
    }
  });

  scene.add(model);
});

// loader.load(
//   //   "./Model/scene.gltf",
//   "./woman/model.glb",
//   function (gltf) {
//     gltf.scene.scale.set(0.07, 0.07, 0.07);
//     gltf.scene.position.set(0, -0.01, 0);
//     gltf.scene.rotation.y = Math.PI; // Turn the model towards the camera
//     model = gltf.scene;
//     console.log(model);
//     scene.add(model);
//   },
//   undefined,
//   function (error) {
//     console.error(error);
//   }
// );

// Plane (ground)
const geometry = new THREE.PlaneGeometry(5, 20, 32);
const material = new THREE.MeshBasicMaterial({
  color: 0x151516,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(geometry, material);
plane.position.y = 0.005;
plane.rotation.x = d2r(90); // Turning the plane horizontal
// scene.add( plane );

// Animation
function animate() {
  requestAnimationFrame(animate);
  //model.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}

animate();
