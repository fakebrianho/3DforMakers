import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass'
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { Vector2 } from 'three'

export function postprocessing(scene, camera, renderer, mesh) {
	const composer = new EffectComposer(renderer)
	composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	composer.setSize(window.innerWidth, window.innerHeight)

	const renderPass = new RenderPass(scene, camera)
	composer.addPass(renderPass)

	const pixelPass = new RenderPixelatedPass(6, scene, camera)
	pixelPass.pixelSize = 10
	pixelPass.normalEdgeStrength = 2
	// composer.addPass(pixelPass)

	const outlinePass = new OutlinePass(
		new Vector2(window.innerWidth, window.innerHeight),
		scene,
		camera
	)
	outlinePass.selectedObjects = [mesh]
	composer.addPass(outlinePass)

	const glitchPass = new GlitchPass()
	glitchPass.enabled = true
	composer.addPass(glitchPass)

	const outputPass = new OutputPass()
	composer.addPass(outputPass)

	return { composer: composer, glitch: glitchPass }
}
