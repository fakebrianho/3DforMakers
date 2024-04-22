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
camera.position.set(0, 2, 5)

//Globals
const meshes = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
let renderCheck = 'ascii'
let controls = new OrbitControls(camera, renderer.domElement)
let composer

const effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true })
effect.setSize(window.innerWidth, window.innerHeight)
effect.domElement.style.color = 'white'
effect.domElement.style.backgroundColor = 'black'
document.body.appendChild(effect.domElement)

const toggleButton = document.createElement('button')
toggleButton.textContent = 'Toggle AsciiEffect'
toggleButton.style.position = 'absolute'
toggleButton.style.top = '10px'
toggleButton.style.left = '10px'
document.body.appendChild(toggleButton)

let asciiEffectEnabled = true

toggleButton.addEventListener('click', () => {
	asciiEffectEnabled = !asciiEffectEnabled
	effect.domElement.style.display = asciiEffectEnabled ? 'block' : 'none'
})

// document.body.appendChild(renderer.domElement)
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

	composer = postprocessing(scene, camera, renderer)
	//scene operations
	scene.add(meshes.default)
	scene.add(meshes.standard)
	scene.add(lights.defaultLight)
	models()
	resize()
	animate()
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
	})
	Ship.init()
}

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
		effect.setSize(window.innerWidth, window.innerHeight)
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
	// renderer.render(scene, camera)
	// console.log(composer)
	// composer.composer.render()
	if (asciiEffectEnabled) {
		effect.render(scene, camera)
	} else {
		composer.composer.render()
	}
	if (meshes.ship) {
		// composer.outlinePass.selectedObjects = [scene]
	}
	requestAnimationFrame(animate)
}
