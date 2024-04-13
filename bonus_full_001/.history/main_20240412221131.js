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
	lights.defaultLight = addLight()
	lights.light1 = addSpotLights().light1
	lights.target1 = addSpotLights().target1
	lights.light2 = addSpotLights().light2
	lights.target2 = addSpotLights().target2
	lights.light3 = addSpotLights().light3
	lights.target3 = addSpotLights().target3

	//changes

	//scene operations
	scene.add(lights.defaultLight)
	scene.add(lights.light1)
	scene.add(lights.target1)
	scene.add(lights.light2)
	scene.add(lights.target2)
	scene.add(lights.light3)
	scene.add(lights.target3)

	flickerLight()
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
let lastChange = 0
let flickerPeriod = 0.5 // How often (in seconds) the flicker intensity updates
let lightBaseIntensity = 2
let flickerIntensity = 1
function flickerLight() {
	const elapsed = clock.getElapsedTime()

	// Only update the flicker intensity at intervals defined by flickerPeriod
	if (elapsed - lastChange > flickerPeriod) {
		lastChange = elapsed

		// Randomize the flicker intensity adjustment each period
		flickerIntensity = Math.random() * 1.5 // Randomize the flicker strength
		flickerPeriod = 0.1 + Math.random() * 0.4 // Randomize how quickly the next change happens
	}

	// Apply a base intensity with a sinusoidal modulation added to the random flicker intensity
	const flicker = Math.sin(elapsed * Math.PI * 2) * flickerIntensity
	lights.light2.intensity = lightBaseIntensity + flicker
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

	flickerLight()
	// meshes.default.scale.x += 0.01

	renderer.render(scene, camera)
}
