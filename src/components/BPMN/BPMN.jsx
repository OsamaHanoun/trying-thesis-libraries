import { useRef, useEffect } from "react";
import BpmnViewer from "bpmn-js";
import file from "./../../assets/diagram.bpmn?raw";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "./BPMN.scss";

export default function BPMN() {
  const canvasRef = useRef(null);
  let viewer;

  async function loadBPMNFile() {
    {
      viewer = new BpmnViewer({
        container: canvasRef.current,
      });

      try {
        await viewer.importXML(file);
        viewer.get("canvas").zoom("fit-viewport");
      } catch (err) {
        console.log(err);
      }
    }
  }

  useEffect(() => {
    !viewer && loadBPMNFile(canvasRef);
  }, []);

  return (
    <div
      ref={canvasRef}
      className="bpmn"
      style={{ height: "100%", flexGrow: "1fr" }}
    />
  );
}
