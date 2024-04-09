import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
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
const mixers = []
const clock = new THREE.Clock()
const controls = new OrbitControls(camera, renderer.domElement)
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
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

	//scene operations
	scene.add(meshes.default)
	scene.add(meshes.standard)
	scene.add(meshes.defaultLight)

	instances()
	raycast()
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
function instances() {
	const flower = new Model({
		name: 'flower',
		scene: scene,
		meshes: meshes,
		url: '/flower.glb',
		scale: new THREE.Vector3(0.1, 0.1, 0.1),
		replace: true,
	})
	flower.initPoints()
}

function raycast() {
	window.addEventListener('click', (event) => {
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
		raycaster.setFromCamera(pointer, camera)
		const intersects = raycaster.intersectObjects(scene.children, true)
		for (let i = 0; i < intersects.length; i++) {
			let object = intersects[i].object
			while (object) {
				if (object.userData.groupName === 'flower') {
					gsap.to(object.scale, {
						x: 5,
						y: 5,
						z: 5,
						duration: 2,
						ease: 'power3.inOut',
					})
					break // Stop the loop if we found our target group
				}
				if (object.userData.groupName === 'target1') {
					gsap.to(object.scale, {
						x: 0.3,
						y: 0.3,
						z: 0.3,
						duration: 2,
						ease: 'power3.inOut',
					})
					break // Stop the loop if we found our target group
				}
				if (object.userData.groupName === 'target2') {
					gsap.to(object.scale, {
						x: 0.0,
						y: 0.0,
						z: 0.0,
						duration: 2,
						ease: 'power3.inOut',
					})
					break // Stop the loop if we found our target group
				}
				object = object.parent
			}
			if (intersects[i].object.userData.name == 'heart') {
				gsap.to(intersects[i].object.scale, {
					x: 2,
					y: 2,
					z: 2,
					duration: 2,
					ease: 'power3.inOut',
				})
			}
			if (intersects[i].object.userData.name == 'target2') {
				gsap.to(intersects[i].object.scale, {
					x: 0.5,
					y: 0.5,
					z: 0.5,
					duration: 2,
					ease: 'power3.inOut',
				})
			}
		}
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
