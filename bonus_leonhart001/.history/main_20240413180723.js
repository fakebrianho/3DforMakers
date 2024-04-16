import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { postprocessing } from './postprocessing'
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect'

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
let effect
let controls
// const composer = postprocessing(scene, camera, renderer)
init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	// document.body.appendChild(renderer.domElement)

	effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true })
	effect.setSize(window.innerWidth, window.innerHeight)
	effect.domElement.style.color = 'white'
	effect.domElement.style.backgroundColor = 'black'
	document.body.appendChild(effect.domElement)
	controls = new OrbitControls(camera, effect.domElement)

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

	resize()
	animate()
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
	requestAnimationFrame(animate)
	const delta = clock.getDelta()

	meshes.default.rotation.x += 0.01
	meshes.default.rotation.z += 0.01

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.z += 0.01

	// meshes.default.scale.x += 0.01

	// renderer.render(scene, camera)
	effect.render(scene, camera)

	// composer.composer.render()
}