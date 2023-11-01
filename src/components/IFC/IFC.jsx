import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as OBC from "openbim-components";

export default function IFC() {
  const refContainer = useRef(null);
  let components = null;
  useEffect(() => {
    // Setting up a components project
    if (!components) {
      components = new OBC.Components();
      components.scene = new OBC.SimpleScene(components);
      components.renderer = new OBC.SimpleRenderer(
        components,
        refContainer.current
      );
      components.camera = new OBC.SimpleCamera(components);
      components.raycaster = new OBC.SimpleRaycaster(components);
      components.init();
      const scene = components.scene.get();
      // Adjusting scene and camera
      components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);
      // Adding some 3D objects
      const cubeMaterial = new THREE.MeshStandardMaterial({ color: "#6528D7" });
      const greenMaterial = new THREE.MeshStandardMaterial({
        color: "#BCF124",
      });
      const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
      const cube1 = new THREE.Mesh(boxGeometry, cubeMaterial);
      const cube2 = new THREE.Mesh(boxGeometry, cubeMaterial);
      cube2.position.x = 5;
      const cube3 = new THREE.Mesh(boxGeometry, cubeMaterial);
      cube3.position.x = -5;
      scene.add(cube1, cube2, cube3);
      const cubes = [cube1, cube2, cube3];
      // Spinning up the cubes
      const oneDegree = Math.PI / 180;
      function rotateCubes() {
        cube1.rotation.x += oneDegree;
        cube1.rotation.y += oneDegree;
        cube2.rotation.x += oneDegree;
        cube2.rotation.z += oneDegree;
        cube3.rotation.y += oneDegree;
        cube3.rotation.z += oneDegree;
      }
      components.renderer.onBeforeUpdate.add(rotateCubes);
      // Casting rays around
      let previousSelection;
      window.onmousemove = () => {
        const result = components.raycaster.castRay(cubes);
        if (previousSelection) {
          previousSelection.material = cubeMaterial;
        }
        if (!result) {
          return;
        }
        result.object.material = greenMaterial;
        previousSelection = result.object;
      };
      // Grid
      const grid = new OBC.SimpleGrid(components);
      const simpleGrid = components.tools.get(OBC.SimpleGrid); // or  components.tools.get();

      // Lighting things up
      components.scene.setup();
    }
  }, []);
  return (
    <div ref={refContainer} style={{ width: "1000px", height: "500px" }}></div>
  );
}
