import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight, addSpotLights } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	50,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
camera.position.set(-19, 7, 11)

//Globals
const meshes = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
const controls = new OrbitControls(camera, renderer.domElement)
init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes

	//lights
	// lights.defaultLight = addLight()
	lights.light1 = addSpotLights().light1
	lights.light2 = addSpotLights().light2
	lights.light3 = addSpotLights().light3

	//changes

	//scene operations
	scene.add(lights.defaultLight)

	models()
	resize()
	animate()
}

function models() {
	const city = new Model({
		name: 'city',
		url: 'city.glb',
		meshes: meshes,
		scene: scene,
	})
	city.init()
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
