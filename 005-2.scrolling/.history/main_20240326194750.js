import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh } from './addMeshes'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
// let mesh
const meshes = {}

init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes
	meshes.default = addBoilerPlateMesh()
	console.log(meshes.default)

	//scene operations
	scene.add(meshes.default)

	animate()
}

function animate() {
	requestAnimationFrame(animate)
	// mesh.position.x += 0.01
	// meshes.default.position.x += 0.01
	// meshes.default.position.y += 0.01
	// meshes.default.rotation.x += 0.01
	// meshes.default.rotation.z += 0.01
	// meshes.default.scale.x += 0.01

	renderer.render(scene, camera)
}
