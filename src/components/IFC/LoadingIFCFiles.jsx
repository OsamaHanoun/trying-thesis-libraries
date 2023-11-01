import { useEffect, useRef } from "react";
import * as OBC from "openbim-components";

// https://platform.thatopen.com/documentation

export default function LoadingIFCFiles() {
  const refContainer = useRef(null);
  let components = null;
  useEffect(() => {
    // Setting up a components project
    if (!components) {
      //////////////setup component//////////////////

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

      // Grid
      const grid = new OBC.SimpleGrid(components);
      const simpleGrid = components.tools.get(OBC.SimpleGrid);
      // Lighting things up
      components.scene.setup();

      ////////////////////////////////
      let fragments = new OBC.FragmentManager(components);
      const toolbar = new OBC.Toolbar(components);
      components.ui.addToolbar(toolbar);
      toolbar.addChild(fragments.uiElement.get("main"));

      //Add Fragment To Scene
      async function loadFragments() {
        if (fragments.groups.length) return;
        const file = await fetch("small.frag");
        const data = await file.arrayBuffer();
        const buffer = new Uint8Array(data);
        fragments.load(buffer);
      }
      const loadButton = new OBC.Button(components);
      loadButton.materialIcon = "download";
      loadButton.tooltip = "Load model";
      toolbar.addChild(loadButton);
      loadButton.onClick.add(() => loadFragments());

      // export fragment

      function exportFragments() {
        if (!fragments.groups.length) return;
        const group = fragments.groups[0];
        const data = fragments.export(group);
        const blob = new Blob([data]);
        const file = new File([blob], "small.frag");
        download(file);
      }
      const exportButton = new OBC.Button(components);
      exportButton.materialIcon = "exit_to_app";
      exportButton.tooltip = "Export model";
      toolbar.addChild(exportButton);
      exportButton.onClick.add(() => exportFragments());

      function download(file) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      //Discard Fragment and Clean the Scene
      function disposeFragments() {
        fragments.dispose();
      }

      const disposeButton = new OBC.Button(components);
      disposeButton.materialIcon = "delete";
      disposeButton.tooltip = "Delete model";
      toolbar.addChild(disposeButton);
      disposeButton.onClick.add(() => disposeFragments());

      function importExternalFragment() {
        if (fragments.groups.length) return;
        const input = document.createElement("input");
        input.type = "file";
        input.onchange = async () => {
          const file = input.files[0];
          if (file.name.includes(".frag")) {
            const url = URL.createObjectURL(file);
            const result = await fetch(url);
            const data = await result.arrayBuffer();
            const buffer = new Uint8Array(data);
            fragments.load(buffer);
          }
          input.remove();
        };
        input.click();
      }
      const openButton = new OBC.Button(components);
      openButton.materialIcon = "folder_open";
      openButton.tooltip = "Import model";
      toolbar.addChild(openButton);
      openButton.onClick.add(() => importExternalFragment());

      // FragmentIfcLoader
      let fragmentIfcLoader = new OBC.FragmentIfcLoader(components);

      const ifcButton = fragmentIfcLoader.uiElement.get("main");
      toolbar.addChild(ifcButton);

      //Calibrating the converter
      fragmentIfcLoader.settings.wasm = {
        path: "https://unpkg.com/web-ifc@0.0.43/",
        absolute: true,
      };

      fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
      fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

      // Loading the IFC

      async function loadIfcAsFragments() {
        const file = await fetch("example.ifc");
        const data = await file.arrayBuffer();
        const buffer = new Uint8Array(data);
        const model = await fragmentIfcLoader.load(buffer);
        scene.add(model);
      }

      // loadIfcAsFragments();
    }
  }, []);
  return (
    <div ref={refContainer} style={{ width: "100vw", height: "100vh" }}></div>
  );
}
