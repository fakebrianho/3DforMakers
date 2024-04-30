import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
camera.position.set(0, 0, 7)
const tLoader = new THREE.TextureLoader()

//Globals
const meshes = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
// const controls = new OrbitControls(camera, renderer.domElement)
// controls
const background = new THREE.Mesh(
	new THREE.PlaneGeometry(5, 5),
	new THREE.MeshBasicMaterial({ map: 'COLOR.jpg' })
)
scene.add(background)
const cameraGroup = new THREE.Group()
const geometry = new THREE.PlaneGeometry(10, 10)
const material = new THREE.MeshPhysicalMaterial({
	map: tLoader.load('col.jpg'),
	displacementMap: tLoader.load('height.png'),
	normalMap: tLoader.load('normal.jpg'),
	roughnessMap: tLoader.load('roughness.jpg'),
	aoMap: tLoader.load('ao.jpg'),
	metalness: 0.4,
	roughness: 0.05,
	transmission: 1,
	ior: 1.45,
	specularIntensity: 0.5,
	clearcoat: 0.1,
	thickness: 1,
})
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(0, 0, 2)
cameraGroup.add(camera)
cameraGroup.add(mesh)
meshes.windows = cameraGroup
const controls = new PointerLockControls(cameraGroup, renderer.domElement)
scene.add(meshes.windows)
// instructions.addEventListener('click', function () {
// 	controls.lock()
// })

// controls.addEventListener('lock', function () {
// 	// instructions.style.display = 'none'
// 	// blocker.style.display = 'none'
// })

// controls.addEventListener('unlock', function () {
// 	// blocker.style.display = 'block'
// 	// instructions.style.display = ''
// })

// scene.add(controls.getObject())

init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes
	meshes.default = addBoilerPlateMesh()
	meshes.standard = addStandardMesh()

	//lights
	lights.defaultLight = addLight()

	//changes
	meshes.default.scale.set(2, 2, 2)

	//scene operations
	scene.add(meshes.default)
	scene.add(meshes.standard)
	scene.add(lights.defaultLight)

	windowPane()
	resize()
	animate()
}

function windowPane() {}
document.body.addEventListener('click', () => {
	controls.lock()
})

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function animate() {
	requestAnimationFrame(animate)
	const delta = clock.getDelta()

	meshes.default.rotation.x += 0.01
	meshes.default.rotation.z += 0.01

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.z += 0.01

	camera.updateMatrixWorld()

	// Update the cameraGroup's matrix
	cameraGroup.updateMatrixWorld()

	renderer.render(scene, camera)
}