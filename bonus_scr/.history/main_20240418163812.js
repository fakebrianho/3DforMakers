import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { WheelAdaptor } from 'three-story-controls'
import { HDRI } from './hdri'
import { manager } from './manager'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
camera.position.set(0, 0, 5)

const wheel = new WheelAdaptor({ type: 'discrete' })

//Globals
let flag = false

const meshes = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
const carBody = []
const controls = new OrbitControls(camera, renderer.domElement)
controls.listenToKeyEvents(window)
// controls.keys = {
// 	LEFT: 'ArrowLeft', //left arrow
// 	UP: 'ArrowUp', // up arrow
// 	RIGHT: 'ArrowRight', // right arrow
// 	BOTTOM: 'ArrowDown', // down arrow
// }
init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes

	//lights

	//changes

	//scene operations

	//environment
	const loadManager = manager()
	scene.background = HDRI(loadManager)
	scene.environment = HDRI(loadManager)

	models(loadManager)
	resize()
	animate()
}

function models(manager) {
	const car = new Model({
		url: 'sports_lite.glb',
		name: 'car',
		meshes: meshes,
		scene: scene,
		manager: manager,
		scale: new THREE.Vector3(0.01, 0.01, 0.01),
		position: new THREE.Vector3(-2.5, -1.2, 1),
		rotation: new THREE.Vector3(0, -Math.PI / 4, 0),
	})
	car.init()
}

function setupConfigure() {
	meshes.car.traverse((part) => {
		if (part.name === 'Body_Body_1_0') {
			carBody.push(part)
		}
		if (
			part.name === 'Door_Left_Body_1_0' ||
			part.name === 'Door_Right_Body_1_0'
		) {
			carBody.push(part)
		}
	})
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
	controls.update()
	if (!flag) {
		if (meshes.car) {
			setupConfigure()
			flag = true
		}
	}

	renderer.render(scene, camera)
}
