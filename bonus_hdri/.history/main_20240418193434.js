import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { manager } from './manager'
import { HDRI } from './environment'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
camera.position.set(0, 0, 5)

//Globals
const meshes = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
const controls = new OrbitControls(camera, renderer.domElement)
controls.autoRotate = true
init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	const loadManager = manager()

	//meshes

	//lights

	//changes

	//scene operations

	scene.background = HDRI(loadManager)
	scene.environment = HDRI(loadManager)

	models(loadManager)
	resize()
	animate()
}

function models(loadManager) {
	const car = new Model({
		scene: scene,
		meshes: meshes,
		url: 'sports_lite.glb',
		name: 'car',
		manager: loadManager,
		scale: new THREE.Vector3(0.01, 0.01, 0.01),
		position: new THREE.Vector3(-2.5, -1.2, 1),
		rotation: new THREE.Vector3(0, -Math.PI / 4, 0),
	})
	car.init()
}

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

	// meshes.default.scale.x += 0.01

	renderer.render(scene, camera)
}
