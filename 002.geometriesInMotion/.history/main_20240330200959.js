import './style.css'
import * as THREE from 'three'
import {
	addBoilerPlateMesh,
	addStandardMesh,
	addPlanet1,
	addPlanet2,
	addPlanet3,
	addPlanet4,
} from './addMeshes'
import { addLight } from './addLights'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)

const controls = new OrbitControls(camera, renderer.domElement)
camera.position.set(0, 0, 5)
const meshes = {}

init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes
	meshes.default = addBoilerPlateMesh()
	meshes.standard = addStandardMesh()
	meshes.planet1 = addPlanet1()
	meshes.planet2 = addPlanet2()
	meshes.planet3 = addPlanet3()
	meshes.planet4 = addPlanet4()

	//lights
	meshes.defaultLight = addLight()

	//scene operations
	scene.add(meshes.default)
	scene.add(meshes.standard)
	scene.add(meshes.defaultLight)
	scene.add(meshes.planet1)
	scene.add(meshes.planet2)
	scene.add(meshes.planet3)
	scene.add(meshes.planet4)

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
	meshes.default.rotation.x += 0.01
	meshes.default.rotation.z += 0.01

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.z += 0.01

	meshes.planet1.rotation.x += 0.01
	meshes.planet1.rotation.z -= 0.03

	meshes.planet2.rotation.x -= 0.02
	meshes.planet2.rotation.z += 0.01

	meshes.planet3.rotation.y -= 0.02
	meshes.planet3.rotation.x += 0.01

	renderer.render(scene, camera)
}
