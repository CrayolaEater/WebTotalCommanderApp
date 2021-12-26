import './App.css';
import Toolbar from "./components/Toolbar/Toolbar";
import DirectoriesPanel from "./components/DirectoriesPanel/DirectoriesPanel";
import React, {useState} from "react";

function App() {

    const [leftPanelCd, setLeftPanelCd] = useState("/");
    const [rightPanelCd, setrightPanelCd] = useState("/");

    return (
        <div className="App">
            <Toolbar/>
            <div className="panels-container">
                <DirectoriesPanel cd={leftPanelCd}/>
                <DirectoriesPanel cd={rightPanelCd}/>
            </div>
        </div>
    );
}

export default App;
