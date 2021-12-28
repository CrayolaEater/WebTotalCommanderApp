import './App.css';
import Toolbar from "./components/Toolbar/Toolbar";
import DirectoriesPanel from "./components/DirectoriesPanel/DirectoriesPanel";
import React, {useEffect, useState} from "react";

function App() {

    const [defaultPaths, setDefaultPaths] = useState([]);
    const [leftDefaultPath, setLeftDefaultPath] = useState(null);
    const [rightDefaultPath, setRightDefaultPath] = useState(null);
    const [leftPanelCd, setLeftPanelCd] = useState("");
    const [rightPanelCd, setRightPanelCd] = useState("");
    const [loading, toggleLoading] = useState(true);

    useEffect(() => {
        fetch(process.env.REACT_APP_SERVER_ADRESS + "/bbbn/getDefaultPaths/")
            .then(result => result.json())
            .then(data => {
                setDefaultPaths(data);
                setLeftDefaultPath(data[0]);
                setRightDefaultPath(data[0]);
                toggleLoading(false);
            })
    }, []);

    useEffect(() => {
        if (leftDefaultPath && leftDefaultPath.key && leftDefaultPath.value) {
            setLeftPanelCd(leftDefaultPath.value);
        }
    }, [leftDefaultPath]);

    useEffect(() => {
        if (rightDefaultPath && rightDefaultPath.key && rightDefaultPath.value) {
            setRightPanelCd(rightDefaultPath.value);
        }
    }, [rightDefaultPath]);


    return (
        <div className="App">
            <Toolbar/>
            <div className="panels-container">

                {
                    !loading && <>

                        <DirectoriesPanel allDefaultPaths={defaultPaths} defaultPaths={leftDefaultPath}
                                          setDefaultPath={setLeftDefaultPath}
                                          setCd={setLeftPanelCd} cd={leftPanelCd}/>
                        <DirectoriesPanel allDefaultPaths={defaultPaths} defaultPaths={rightDefaultPath}
                                          setDefaultPath={setRightDefaultPath}
                                          setCd={setRightPanelCd} cd={rightPanelCd}/>

                    </>
                }

            </div>
        </div>
    );
}

export default App;
