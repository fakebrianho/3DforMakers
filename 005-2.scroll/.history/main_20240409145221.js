import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { WheelAdaptor } from 'three-story-controls'
import gsap from 'gsap'

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
let currentItem = 0
const positions = []
const mixers = []
const clock = new THREE.Clock()
const wheelAdaptor = new WheelAdaptor({ type: 'discrete' })
let viewPosition = new THREE.Vector3(0, 0, 2)
wheelAdaptor.connect()
wheelAdaptor.addEventListener('trigger', (event) => {
	meshes.default.scale.y += event.y * 0.5
	// gsap.to(camera.position, {})
	currentItem++
	if (currentItem > positions.length) {
		currentItem = 0
	}
})
init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes
	meshes.default = addBoilerPlateMesh()
	meshes.standard = addStandardMesh()

	//lights
	meshes.defaultLight = addLight()

	//changes
	meshes.default.scale.set(2, 2, 2)
	// meshes.default.position.set(viewPosition.x, viewPosition.y, viewPosition.z)
	meshes.default.position.set(...viewPosition)
	Array.from(meshes).forEach((mesh) => {
		positions.push({ defaultPosition: mesh.position })
		//
	})
	//scene operations
	scene.add(meshes.default)
	scene.add(meshes.standard)
	scene.add(meshes.defaultLight)

	resize()
	animate()
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

	meshes.default.rotation.x += 0.01
	meshes.default.rotation.z += 0.01

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.z += 0.01

	// meshes.default.scale.x += 0.01

	renderer.render(scene, camera)
}
