// import "@babylonjs/core/Debug/debugLayer";
// import "@babylonjs/inspector";
import {
	Animation,
	Effect,
	Engine,
	Scene,
	ArcRotateCamera,
	Vector3,
	HemisphericLight,
	Color3,
	// Mesh,
	MeshBuilder,
	ShaderMaterial,
} from "@babylonjs/core";

import fragment from "./Shaders/test.frag";
import vertex from "./Shaders/boid.vert";

class App {
	constructor() {
		// create the canvas html element and attach it to the webpage
		const canvas = document.createElement("canvas");
		const container = document.getElementById("scene-container");
		canvas.style.width = "100%";
		canvas.style.height = "100%";
		canvas.id = "gameCanvas";
		container.appendChild(canvas);

		// initialize Babylon scene and engine
		var engine = new Engine(canvas, true);
		var scene = new Scene(engine);

		var camera: ArcRotateCamera = new ArcRotateCamera(
			"Camera",
			Math.PI / 2,
			Math.PI / 2,
			13,
			Vector3.Zero(),
			scene
		);
		camera.attachControl(canvas, true);
		const light1: HemisphericLight = new HemisphericLight(
			"light1",
			new Vector3(1, 1, 0),
			scene
		);

		Effect.ShadersStore["customVertexShader"] = vertex;
		Effect.ShadersStore["customFragmentShader"] = fragment;

		// create a new GLSL material
		var material = new ShaderMaterial(
			"material",
			scene,
			{
				vertex: "custom",
				fragment: "custom",
			},
			{
				attributes: ["position", "velocity"],
				uniforms: [
					"worldViewProjection",
					"time",
					"color",
					"boidPositions",
					"boidVelocities",
					"boidCount",
					"separationDistance",
					"alignmentDistance",
					"cohesionDistance",
				],
			}
		);

		// set the initial values for the uniforms
		material.setFloat("separationDistance", 0.1);
		material.setFloat("alignmentDistance", 0.2);
		material.setFloat("cohesionDistance", 0.3);

		// create boids
		var boids = [];
		var boidPositions = [];
		var boidVelocities = [];
		var boidCount = 100;

		for (var i = 0; i < boidCount; i++) {
			var boid = MeshBuilder.CreateSphere("boid", {diameter: 0.1}, scene);
			boid.material = material;
			boid.position = new Vector3(
				Math.random() * 10 - 5,
				Math.random() * 10 - 5,
				Math.random() * 10 - 5
			);
			boid.velocity = new Vector3(
				Math.random() * 2 - 1,
				Math.random() * 2 - 1,
				Math.random() * 2 - 1
			);
			boids.push(boid);
			boidPositions.push(
				boid.position.x,
				boid.position.y,
				boid.position.z
			);
			boidVelocities.push(
				boid.velocity.x,
				boid.velocity.y,
				boid.velocity.z
			);
		}

		scene.registerBeforeRender(() => {
			var boidPositions = [];
			var boidVelocities = [];
			for (var i = 0; i < boidCount; i++) {
				boidPositions.push(
					boids[i].position.x,
					boids[i].position.y,
					boids[i].position.z
				);
				boidVelocities.push(
					boids[i].velocity.x,
					boids[i].velocity.y,
					boids[i].velocity.z
				);
			}
		});

		// set the boidPositions and boidVelocities uniforms with the correct values
		material.setArray3("boidPositions", boidPositions);
		material.setArray3("boidVelocities", boidVelocities);
		material.setInt("boidCount", boidCount);

		// create a new animation that will update the boid positions and velocities
		var animation = new Animation(
			"animation",
			"time",
			30,
			Animation.ANIMATIONTYPE_FLOAT,
			Animation.ANIMATIONLOOPMODE_CYCLE
		);
		var keys = [];
		keys.push({
			frame: 0,
			value: 0,
		});
		keys.push({
			frame: 30,
			value: 1,
		});
		animation.setKeys(keys);

		for (var i = 0; i < boidCount; i++) {
			boids[i].animations = [animation];
			scene.beginAnimation(boids[i], 0, 30, true);
		}

		// await animation.waitAsync();

		// hide/show the Inspector
		// window.addEventListener("keydown", (ev) => {
		// 	// Shift+Ctrl+Alt+I
		// 	if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
		// 		if (scene.debugLayer.isVisible()) {
		// 			scene.debugLayer.hide();
		// 		} else {
		// 			scene.debugLayer.show();
		// 		}
		// 	}
		// });

		var time = 0;
		// run the main render loop
		engine.runRenderLoop(() => {
			material.setArray3("boidPositions", boidPositions);
			material.setArray3("boidVelocities", boidVelocities);

			scene.render();
			material.setFloat("time", time);
			time += 0.02;
		});
	}
}
new App();
