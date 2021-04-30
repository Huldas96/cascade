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
controls.enablePan = true;
controls.enableZoom = true;
controls.minPolarAngle = d2r(98); // I Set the same value for min and max polar angle to disable vertical orbit control
controls.maxPolarAngle = d2r(98); // It can be set between 0 and PI
controls.target.y = 1; // moving the focus point up

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
const gridHelper = new THREE.GridHelper( 10, 10 );
scene.add( gridHelper );

// Load the Model
var model;
const loader = new GLTFLoader();
loader.load("./woman/model.glb", function (gltf) {
  gltf.scene.scale.set(0.08, 0.08, 0.08);
  gltf.scene.position.set(0, 0, 0);
  gltf.scene.rotation.y = 5;
  model = gltf.scene;

  model.traverse((child) => {
    //console.log(child);

    if (child.name === "HumanFemale_bone_Head") {
      console.log(child);
      let size = 0.9
      child.scale.set(size, size, size);
    }
  });

  scene.add(model);
});

// MODEL LOCATION THINGS:

// HumanFemale_bone_Head = Head
// HumanFemale_bone_16 = Body above waist
// HumanFemale_bone_2 = Body below waist

// BREASTS
// HumanFemale_bone_23 = Left Breast
// HumanFemale_bone_26 = Right Breast

// RIGHT ARM
// HumanFemale_bone_43 = Right Arm Elbow
// HumanFemale_bone_45 = Right upper Arm 
// HumanFemale_bone_51 = Right lower Arm
// HumanFemale_bone_53 = Right Hand 

// LEFT ARM
// HumanFemale_bone_40 = Left Arm Elbow
// HumanFemale_bone_41 = Left upper Arm
// HumanFemale_bone_49 = Left lower Arm
// HumanFemale_bone_48 = Left Hand

// RIGHT LEG
// HumanFemale_bone_6 = Right Leg
// HumanFemale_bone_12 = Right Thigh
// HumanFemale_bone_38 = Right Foot
// HumanFemale_bone_27 = Right Foot and ankle

// LEFT LEG
// HumanFemale_bone_8 = Left Leg
// HumanFemale_bone_15 = Left Thigh
// HumanFemale_bone_39 = Left Foot
// HumanFemale_bone_20 = Left Foot and ankle

//


// Plane (ground)
//const geometry = new THREE.PlaneGeometry(5, 20, 32);
//const material = new THREE.MeshBasicMaterial({
//  color: 0x151516,
//  side: THREE.DoubleSide,
//});
//const plane = new THREE.Mesh(geometry, material);
//plane.position.y = 0.005;
//plane.rotation.x = d2r(90); // Turning the plane horizontal
// scene.add( plane );

// Animation
function animate() {
  requestAnimationFrame(animate);
  //model.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}

animate();
