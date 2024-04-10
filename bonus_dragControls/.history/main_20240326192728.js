import './style.css'
import * as THREE from 'three'

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
	const geometry = new THREE.BoxGeometry(1, 1, 1)
	const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
	const mesh = new THREE.Mesh(geometry, material)
	mesh.position.set(0, 0, -5)

	meshes.default = mesh
	scene.add(meshes.default)
	animate()
}

function animate() {
	requestAnimationFrame(animate)
	// mesh.position.x += 0.01
	meshes.default.position.x += 0.01
	renderer.render(scene, camera)
}
