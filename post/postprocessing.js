import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass'
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass'

export function postprocessing(scene, camera, renderer) {
	const composer = new EffectComposer(renderer)
	composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	composer.setSize(window.innerWidth, window.innerHeight)

	const renderPass = new RenderPass(scene, camera)
	composer.addPass(renderPass)

	const glitchPass = new GlitchPass()
	// glitchPass.goWild = true
	// composer.addPass(glitchPass)

	const pixelPass = new RenderPixelatedPass(2, scene, camera)
	pixelPass.normalEdgeStrength = 20
	composer.addPass(pixelPass)

	const afterPass = new AfterimagePass()
	afterPass.uniforms.damp.value = 0.19
	composer.addPass(afterPass)

	const bloomPass = new UnrealBloomPass()
	bloomPass.strength = 0.9
	composer.addPass(bloomPass)
	bloomPass.enabled = true

	const outputPass = new OutputPass()
	composer.addPass(outputPass)

	return { composer: composer, bloom: bloomPass, after: afterPass }
}
