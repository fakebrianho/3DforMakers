// import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight, addSpotLights } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { postprocessing } from './postprocessing'
import Clickable from './Clickable'
import gsap from 'gsap'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	50,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
camera.position.set(-19, 10, 11)

//Globals
const meshes = {}
const lights = {}
const mixers = []
const hoverable = []
const clock = new THREE.Clock()
const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableRotate = false
const interactables = []
const defaultPosition = new THREE.Vector3(-19, 10, 11)

//Raycaster
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

//Current Active
let activeScene = { name: null, light: null }

//loader Flag
let checkModelLoad = true

//Interaction Flag
let isAnimating = false

//Postprocessing Flag
let glitchFlag = false

let composer

//Audio
let audioSwitch = false
const interactionFX1 = document.querySelector('#audio1')
const interactionFX2 = document.querySelector('#audio2')
const glitchFX = document.querySelector('#audio4')

init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//lights
	lights.defaultLight = addLight()
	lights.light1 = addSpotLights().light1
	lights.target1 = addSpotLights().target1
	lights.light2 = addSpotLights().light2
	lights.target2 = addSpotLights().target2
	lights.light3 = addSpotLights().light3
	lights.target3 = addSpotLights().target3

	//changes

	//scene operations
	scene.add(lights.defaultLight)
	scene.add(lights.light1)
	scene.add(lights.target1)
	scene.add(lights.light2)
	scene.add(lights.target2)
	scene.add(lights.light3)
	scene.add(lights.target3)

	addInteraction()
	raycasting()
	flickerLight()
	models()
	resize()
	animate()
}

function addInteraction() {
	const treeTag = new Clickable({
		intensity: 0,
		scene: scene,
		lights: lights,
		name: 'treeTag',
		position: new THREE.Vector3(-7.937, 2.669, -2.561),
		lookPosition: new THREE.Vector3(-10, 2.0, 1.476),
		container: interactables,
	})
	treeTag.init()
	const cafeTag = new Clickable({
		intensity: 0,
		scene: scene,
		lights: lights,
		name: 'cafeTag',
		position: new THREE.Vector3(1.179, 3.514, -2.715),
		lookPosition: new THREE.Vector3(-3.114, 3.547, -1.379),
		container: interactables,
	})
	cafeTag.init()
	const constructionTag = new Clickable({
		intensity: 0,
		scene: scene,
		lights: lights,
		name: 'constructionTag',
		position: new THREE.Vector3(4.502, 1.083, 0.119),
		lookPosition: new THREE.Vector3(2.991, 1.891, 3.411),
		container: interactables,
	})
	constructionTag.init()
	const plantTag = new Clickable({
		intensity: 0,
		scene: scene,
		lights: lights,
		name: 'plantTag',
		position: new THREE.Vector3(8.043, 1.634, -2.045),
		lookPosition: new THREE.Vector3(9.401, 1.384, 0.52),
		container: interactables,
	})
	plantTag.init()
	const carTag = new Clickable({
		intensity: 0,
		scene: scene,
		lights: lights,
		name: 'carTag',
		position: new THREE.Vector3(7.322, 1.995, 6.458),
		lookPosition: new THREE.Vector3(7.396, 2.601, 0.837),
		container: interactables,
	})
	carTag.init()
	const pipeTag = new Clickable({
		intensity: 0,
		scene: scene,
		lights: lights,
		name: 'pipeTag',
		position: new THREE.Vector3(-2.169, 1.334, 2.496),
		lookPosition: new THREE.Vector3(-3.789, 2.932, -3.621),
		container: interactables,
	})
	pipeTag.init()
	const dumpsterTag = new Clickable({
		intensity: 0,
		scene: scene,
		lights: lights,
		name: 'dumpsterTag',
		position: new THREE.Vector3(-9.094, 2.708, 7.736),
		lookPosition: new THREE.Vector3(-4.058, 3.664, 10.542),
		container: interactables,
	})
	dumpsterTag.init()
}

function moveTarget({ x, y, z }) {
	gsap.to(controls.target, {
		x: x,
		y: y - 1.0,
		z: z,
		duration: 2,
		ease: 'power3.inOut',
		onUpdate: () => {
			controls.update()
		},
	})
}

function loader() {
	const btn = document.querySelector('.EnterButton')
	btn.innerHTML = 'Enter'
	btn.classList.remove('active')
	btn.addEventListener('click', () => {
		gsap.to('.loader', {
			opacity: 0,
			duration: 10,
		})
		gsap.to(btn, {
			opacity: 0,
			duration: 5,
			ease: 'power4',
		})

		const bgMusic = document.querySelector('#audio3')
		bgMusic.play()
	})
}

function moveCamera(position, targetName) {
	if (targetName === undefined) {
		gsap.to(camera.position, {
			x: position.x,
			y: position.y,
			z: position.z,
			duration: 2,
			ease: 'power3.inOut',
			onComplete: () => {
				glitchTimeline()
			},
		})
		revealClue(undefined)
	}
	gsap.to(camera.position, {
		x: position.x,
		y: position.y,
		z: position.z,
		duration: 2,
		ease: 'power3.inOut',
		onComplete: () => {
			revealClue(targetName)
		},
	})
}
function glitchTimeline() {
	const alternateDimension = gsap.timeline()
	alternateDimension.to(composer.glitch, { enabled: true })
	alternateDimension.to(composer.glitch, { enabled: false }, 1)
	alternateDimension.call(() => {
		glitchFlag = true
	})
	alternateDimension.call(
		() => {
			composer.outline.enabled = false
			composer.bloom.enabled = false
			composer.pixel.enabled = false
			glitchFlag = false
			composer.glitch.enabled = true
		},
		null,
		'+=2'
	)
	alternateDimension.call(
		() => {
			composer.outline.enabled = true
			composer.bloom.enabled = true
			composer.pixel.enabled = true
			composer.glitch.enabled = false
		},
		null,
		'+=1'
	)
	// alternateDimension.call(
	// 	() => {
	// 		glitchFlag = false
	// 	},
	// 	null,
	// 	'+=2'
	// )
}

function raycasting() {
	window.addEventListener('click', (event) => {
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
		raycaster.setFromCamera(pointer, camera)
		const intersects = raycaster.intersectObjects(interactables, true)
		for (let i = 0; i < intersects.length; i++) {
			const object = intersects[0].object.parent
			if (!isAnimating) {
				isAnimating = true
				if (
					activeScene.name &&
					activeScene.name !== object.userData.name
				) {
				}
				if (object.userData.name === activeScene.name) {
					deactivate(object.userData.name, object)
				} else {
					activate(object.userData.name, object)
					activeScene.name = object.userData.name
					activeScene.light = object
					interactionSound()
				}
			}
		}
	})
}

function deactivate(modalName, light) {
	light.intensity = 0
	light.activate = false
	moveTarget({ x: 0, y: 0, z: 0 })
	moveCamera(defaultPosition, undefined)
	// const alternateDimension = gsap.timeline()
	// alternateDimension.to(composer.glitch, { enabled: true })
	// composer.glitch.enabled = true
	// setTimeout(() => {
	// 	composer.glitch.enabled = false
	// }, 2000)
	// setTimeout(() => {
	// 	glitchFlag = true
	// }, 4000)
	// setTimeout(() => {
	// 	glitchFlag = false
	// }, 6000)
}

function activate(modalName, light) {
	light.intensity = 1
	light.activate = true
	moveTarget({ ...light.position })
	moveCamera(light.userData.lookAt, modalName)
}

function revealClue(name) {
	switch (name) {
		case `${name}`:
			gsap.to(`.${name}`, {
				opacity: 0.8,
				duration: 0.3,
				onComplete: () => {
					isAnimating = false
				},
			})
			break
		case undefined:
			gsap.to(`.${activeScene.name}`, {
				opacity: 0,
				duration: 0.3,
				onComplete: () => {
					isAnimating = false
				},
			})
			activeScene.name = null
			activeScene.light = null
			break
	}
}

function interactionSound() {
	if (audioSwitch) {
		interactionFX1.play()
	} else {
		interactionFX2.play()
	}
	audioSwitch = !audioSwitch
}

function models() {
	const city = new Model({
		name: 'city',
		url: 'city.glb',
		meshes: meshes,
		scene: scene,
		hoverable: hoverable,
	})
	city.init()
	composer = postprocessing(scene, camera, renderer, hoverable)
}

function flickerLight() {
	const rng = Math.random()
	lights.light2.intensity = rng * 5
	const nextFlickerIn = 100 + Math.random() * 200 // Random delay between 100ms and 500ms

	// Schedule the next flicker
	setTimeout(flickerLight, nextFlickerIn)
}

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
		composer.composer.setSize(window.innerWidth, window.innerHeight)
	})
}

function animate() {
	requestAnimationFrame(animate)
	const delta = clock.getDelta()
	if (checkModelLoad) {
		if (meshes.city) {
			checkModelLoad = false

			loader()
		}
	}

	if (!glitchFlag) {
		composer.composer.render()
	} else {
		renderer.render(scene, camera)
	}
}
