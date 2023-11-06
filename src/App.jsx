// import { useState } from "react";
// import IFC from "./components/IFC/FragmentIfcLoader";
import IFC from "./components/IFC/LoadingIFCFiles";

import "./App.scss";
import BPMN from "./components/BPMN/BPMN";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <div className="layout">
      <BPMN />
      <IFC />
    </div>
  );
}

export default App;
