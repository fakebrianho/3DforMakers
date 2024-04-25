import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { postprocessing } from './postprocessing'
import { AsciiEffect } from 'three/examples/jsm/Addons.js'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
camera.position.set(0, 1.0, 5)
var time = 0
var newPosition = new THREE.Vector3()
var matrix = new THREE.Matrix4()

var stop = 1
var DEGTORAD = 0.01745327
var temp = new THREE.Vector3()
var dir = new THREE.Vector3()
var a = new THREE.Vector3()
var b = new THREE.Vector3()
var coronaSafetyDistance = 0.3
var velocityVertical = 0.0
var velocityHoriontal = 0.0
var speedVertical = 0.0
var speedHorizontal = 0.0
let goal, follow
const keys = {
	a: false,
	s: false,
	d: false,
	w: false,
}

goal = new THREE.Object3D()
follow = new THREE.Object3D()
follow.position.z = -coronaSafetyDistance

//Globals
const meshes = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
let controls
let composer

let effect

const toggleButton = document.createElement('button')
toggleButton.textContent = 'Toggle AsciiEffect'
toggleButton.style.position = 'absolute'
toggleButton.style.top = '10px'
toggleButton.style.zIndex = '3'
toggleButton.style.left = '10px'
document.body.appendChild(toggleButton)

let asciiEffectEnabled = true

toggleButton.addEventListener('click', () => {
	asciiEffectEnabled = !asciiEffectEnabled
	effect.domElement.style.display = asciiEffectEnabled ? 'block' : 'none'
	renderer.domElement.style.display = asciiEffectEnabled ? 'none' : 'block'
	// if (asciiEffectEnabled) {
	// 	controls = new OrbitControls(camera, effect.domElement)
	// } else {
	// 	controls = new OrbitControls(camera, renderer.domElement)
	// }
})

// document.body.appendChild(renderer.domElement)
init()
function init() {
	const width = window.innerWidth
	const height = window.innerHeight
	renderer.setSize(width)
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0'
	renderer.domElement.style.left = '0'

	//ASCII
	effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true })
	effect.setSize(width, height)
	effect.domElement.style.color = 'white'
	effect.domElement.style.backgroundColor = 'black'
	effect.domElement.style.position = 'absolute'
	effect.domElement.style.top = '0'
	effect.domElement.style.left = '0'
	// controls = new OrbitControls(camera, effect.domElement)

	document.body.appendChild(renderer.domElement)
	document.body.appendChild(effect.domElement)

	//meshes
	meshes.default = addBoilerPlateMesh()
	meshes.standard = addStandardMesh()

	//lights
	lights.defaultLight = addLight()

	//changes
	meshes.default.scale.set(2, 2, 2)

	composer = postprocessing(scene, camera, renderer)

	goal.add(camera)
	//scene operations
	scene.add(meshes.default)
	scene.add(meshes.standard)
	scene.add(lights.defaultLight)
	keySetup()
	models()
	resize()
	animate()
}

function keySetup() {
	window.addEventListener('keydown', (e) => {
		if (keys[e.key] !== undefined) keys[e.key] = true
		console.log(keys)
	})
	window.addEventListener('keyup', (e) => {
		if (keys[e.key] !== undefined) keys[e.key] = false
	})
}

function models() {
	const Ship = new Model({
		name: 'ship',
		url: '/sbneko.glb',
		scene: scene,
		meshes: meshes,
		scale: new THREE.Vector3(0.6, 0.6, -0.6),
		position: new THREE.Vector3(0, 0, -1),
		replace: true,
		//replaceURL: '/newMatcap.png',
		mixers: mixers,
		follow: follow,
	})
	Ship.init()
}

function resize() {
	window.addEventListener('resize', () => {
		const width = window.innerWidth
		const height = window.innerHeight

		camera.aspect = width / height
		camera.updateProjectionMatrix()

		renderer.setSize(width, height)
		effect.setSize(width, height)
	})
}

function animate() {
	const delta = clock.getDelta()

	meshes.default.rotation.x += 0.01
	meshes.default.rotation.z += 0.01

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.z += 0.01

	// meshes.default.scale.x += 0.01
	//
	// console.log(composer)
	// composer.composer.render()
	speedVertical = 0.0
	speedHorizontal = 0.0

	if (keys.w) speedVertical = 0.01
	else if (keys.s) speedVertical = -0.01

	if (keys.d) speedHorizontal = 0.01
	else if (keys.a) speedHorizontal = -0.01
	velocityVertical += (speedVertical - velocityVertical) * 0.5
	velocityHoriontal += (speedHorizontal - velocityHoriontal) * 0.5
	if (asciiEffectEnabled) {
		renderer.clear()

		effect.render(scene, camera)
	} else {
		renderer.clear()
		// renderer.render(scene, camera)
		composer.composer.render()
	}
	// controls.update()
	if (meshes.ship) {
		meshes.ship.translateY(velocityVertical)
		meshes.ship.translateX(velocityHoriontal)

		a.lerp(meshes.ship.position, 0.4)
		b.copy(goal.position)

		dir.copy(a).sub(b).normalize()
		const dis = a.distanceTo(b) - coronaSafetyDistance
		goal.position.addScaledVector(dir, dis)
		goal.position.lerp(temp, 0.02)
		temp.setFromMatrixPosition(follow.matrixWorld)
		camera.lookAt(meshes.ship.position)
	}
	requestAnimationFrame(animate)
}
