import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import vertexShader from "./glsl/vertex.glsl";
import fragmentShader from "./glsl/fragment.glsl";
import img from "../img/erenyeager.png";

class Gl {
  constructor() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      100
    );
    this.camera.position.z = 3;

    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#app"),
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xffffff, 1);

    this.clock = new THREE.Clock();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.onResize();
  }

  init() {
    // this.mouseMovement();
    this.createMesh();
    this.addEvents();
    this.run();
    this.render();
    this.onResize();
  }

  mouseMovement() {
    window.addEventListener(
      "mousemove",
      (event) => {
        this.mouse.x = (event.clientX / this.width) * 2 - 1;
        this.mouse.y = -(event.clientY / this.height) * 2 + 1;

        // update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.object[0]);

        if (intersects.length > 0) {
          intersects[0].object.material.color.set(0xff0000);
        }
      },
      false
    );
  }

  createMesh() {
    this.geometry = new THREE.PlaneGeometry(2.2, 2.6, 32, 32);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uTexture: {
          value: new THREE.TextureLoader().load(img),
        },
      },
      // wireframe: true,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  addEvents() {
    window.requestAnimationFrame(this.run.bind(this));
    window.addEventListener("resize", this.onResize.bind(this), false);
  }

  run() {
    requestAnimationFrame(this.run.bind(this));
    this.render();
  }

  render() {
    this.material.uniforms.uTime.value = this.clock.getElapsedTime();
    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(w, h);
  }
}

export default Gl;
