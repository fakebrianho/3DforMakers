import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'

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
// const controls = new OrbitControls(camera, renderer.domElement)
let controls
// instructions.addEventListener('click', function () {
// 	controls.lock()
// })

// controls.addEventListener('lock', function () {
// 	// instructions.style.display = 'none'
// 	// blocker.style.display = 'none'
// })

// controls.addEventListener('unlock', function () {
// 	// blocker.style.display = 'block'
// 	// instructions.style.display = ''
// })

// scene.add(controls.getObject())

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

	//scene operations
	scene.add(meshes.default)
	scene.add(meshes.standard)
	scene.add(lights.defaultLight)

	windowPane()
	resize()
	animate()
}

function windowPane() {
	const cameraGroup = new THREE.Group()
	const geometry = new THREE.PlaneGeometry(3, 3)
	const material = new THREE.MeshNormalMaterial()
	const mesh = new THREE.Mesh(geometry, material)
	cameraGroup.add(camera)
	cameraGroup.add(mesh)
	meshes.windows = cameraGroup
	const controls = new PointerLockControls(
		meshes.windows,
		renderer.domElement
	)
	scene.add(meshes.windows)
}
document.body.addEventListener('click', () => {
	controls.lock()
})

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

	const getCameraRotate = new THREE.Vector3()
	camera.getWorldDirection(getCameraRotate)
	getCameraRotate.y = 0
	getCameraRotate.add(meshes.windows.position)
	// meshes.windows.lookAt(getCameraRotate)
	meshes.windows.rotation.copy(camera.rotation)
	// meshes.default.scale.x += 0.01

	renderer.render(scene, camera)
}
