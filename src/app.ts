import * as BABYLON from "@babylonjs/core";
import fragment from "./Shaders/_test.frag";
import vertex from "./Shaders/_boid.vert";

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
		const engine = new BABYLON.Engine(canvas, true);
		const scene = new BABYLON.Scene(engine);

		const camera: BABYLON.ArcRotateCamera = new BABYLON.ArcRotateCamera(
			"Camera",
			Math.PI / 2,
			Math.PI / 2,
			13,
			BABYLON.Vector3.Zero(),
			scene
		);
		camera.attachControl(canvas, true);
		const light1: BABYLON.HemisphericLight = new BABYLON.HemisphericLight(
			"light1",
			new BABYLON.Vector3(1, 1, 0),
			scene
		);

		BABYLON.Effect.ShadersStore["customVertexShader"] = vertex;
		BABYLON.Effect.ShadersStore["customFragmentShader"] = fragment;

		//////////////////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////////

		// create a new GLSL material
		let material = new BABYLON.ShaderMaterial(
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
		let boids = [];
		let boidPositions = [];
		let boidVelocities = [];
		let boidCount = 100;
		for (var i = 0; i < boidCount; i++) {
			var boid = BABYLON.MeshBuilder.CreateSphere(
				"boid",
				{diameter: 0.1},
				scene
			);
			boid.material = material;
			boid.position = new BABYLON.Vector3(
				Math.random() * 10 - 5,
				Math.random() * 10 - 5,
				Math.random() * 10 - 5
			);
			boid.velocity = new BABYLON.Vector3(
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

		material.setArray3("boidPositions", boidPositions);
		material.setArray3("boidVelocities", boidVelocities);
		material.setInt("boidCount", boidCount);

		// create a new animation that will update the boid positions and velocities
		var animation = new BABYLON.Animation(
			"animation",
			"time",
			30,
			BABYLON.Animation.ANIMATIONTYPE_FLOAT,
			BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
		);
		var keys = [];
		keys.push({
			frame: 0,
			value: 0,
		});
		keys.push({
			frame: 300,
			value: 1,
		});
		animation.setKeys(keys);

		for (var i = 0; i < boidCount; i++) {
			boids[i].animations = [animation];
			scene.beginAnimation(boids[i], 0, 30, true);
		}

		var time = 0;
		// run the main render loop
		engine.runRenderLoop(() => {
			// set the boidPositions and boidVelocities uniforms with the correct values
			boidPositions = [];
			boidVelocities = [];
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
			material.setArray3("boidPositions", boidPositions);
			material.setArray3("boidVelocities", boidVelocities);

			scene.render();
			material.setFloat("time", time);
			time += 0.02;
		});
	}
}

new App();
console.log(App);
