import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass'
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { Mesh, Vector2 } from 'three'
import { AsciiEffect } from 'three/examples/jsm/Addons.js'

export function postprocessing(scene, camera, renderer) {
	console.log(camera)
	const composer = new EffectComposer(renderer)
	composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	composer.setSize(window.innerWidth, window.innerHeight)

	const effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true })
	effect.setSize(window.innerWidth, window.innerHeight)
	effect.domElement.style.color = 'white'
	effect.domElement.style.backgroundColor = 'black'
	composer.addPass(effect)

	const renderPass = new RenderPass(scene, camera)
	composer.addPass(renderPass)

	const pixelPass = new RenderPixelatedPass(2, scene, camera)
	pixelPass.normalEdgeStrength = 2
	pixelPass.pixelSize = 5
	pixelPass.enabled = false
	composer.addPass(pixelPass)
	const outlinePass = new OutlinePass(
		new Vector2(window.innerWidth, window.innerHeight),
		scene,
		camera
	)
	outlinePass.edgeStrength = 5
	outlinePass.edgeThickness = 5
	outlinePass.visibleEdgeColor.set('green')
	outlinePass.hiddenEdgeColor.set('green')
	// outlinePass.selectedObjects = []
	composer.addPass(outlinePass)
	const afterPass = new AfterimagePass()
	afterPass.uniforms.damp.value = 0.899
	afterPass.damp = 0
	composer.addPass(afterPass)
	const bloomPass = new UnrealBloomPass()
	bloomPass.strength = 0.7
	composer.addPass(bloomPass)
	const outputPass = new OutputPass()
	composer.addPass(outputPass)
	return { composer: composer, outlinePass: outlinePass }
}
