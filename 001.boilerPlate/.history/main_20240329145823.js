import './style.css'
import * as THREE from 'three'
import { addDefaultMesh, addStandardMesh } from './addMeshes'
import { addLights } from './addLights'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
camera.position.set(0, 0, 5)
const meshes = {}
const lights = {}

init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes
	meshes.default = addDefaultMesh()
	meshes.standard = addStandardMesh()

	//lights

	//scene operations
	scene.add(meshes.default)
	scene.add(meshes.standard)

	resize()
	animate()
}

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerHeight, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function animate() {
	requestAnimationFrame(animate)
	renderer.render(scene, camera)
}
