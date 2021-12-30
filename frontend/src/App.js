import './App.css';
import Toolbar from "./components/Toolbar/Toolbar";
import DirectoriesPanel from "./components/DirectoriesPanel/DirectoriesPanel";
import React, {useEffect, useState} from "react";
import newFolderIcon from "./assets/new-folder-icon.png";
import newFileIcon from "./assets/new-file-icon.png";

function App() {

    const [defaultPaths, setDefaultPaths] = useState([]);
    const [leftDefaultPath, setLeftDefaultPath] = useState(null);
    const [rightDefaultPath, setRightDefaultPath] = useState(null);
    const [leftPanelCd, setLeftPanelCd] = useState("");
    const [rightPanelCd, setRightPanelCd] = useState("");
    const [loading, toggleLoading] = useState(true);
    const [focusedPanel, setFocusedPanel] = useState(1);
    const [createNewFolder, toggleCreateNewFolder] = useState(false);
    const [createNewFile, toggleCreateNewFile] = useState(false);

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
            <Toolbar>
                <button onClick={() => {
                    toggleCreateNewFolder(true);
                }} className="button new-folder-btn">
                    <img src={newFolderIcon} alt="new folder"/>
                </button>

                <button onClick={() => {
                    toggleCreateNewFile(true);
                }} className="button new-file-btn">
                    <img src={newFileIcon} alt="new folder"/>
                </button>


            </Toolbar>
            <div className="panels-container">

                {
                    !loading && <>

                        <DirectoriesPanel allDefaultPaths={defaultPaths} defaultPaths={leftDefaultPath}
                                          setDefaultPath={setLeftDefaultPath}
                                          setCd={setLeftPanelCd} cd={leftPanelCd}
                                          newFolder={createNewFolder && focusedPanel === 1}
                                          setFocusedPanel={setFocusedPanel}
                                          toggleCreateNewFolder={toggleCreateNewFolder}
                                          panelIndex={1}
                                          newFile={createNewFile && focusedPanel === 1}
                                          toggleCreateNewFile={toggleCreateNewFile}
                        />
                        <DirectoriesPanel allDefaultPaths={defaultPaths} defaultPaths={rightDefaultPath}
                                          setDefaultPath={setRightDefaultPath}
                                          setCd={setRightPanelCd} cd={rightPanelCd}
                                          newFolder={createNewFolder && focusedPanel === 2}
                                          setFocusedPanel={setFocusedPanel}
                                          toggleCreateNewFolder={toggleCreateNewFolder}
                                          panelIndex={2}
                                          newFile={createNewFile && focusedPanel === 2}
                                          toggleCreateNewFile={toggleCreateNewFile}


                        />

                    </>
                }

            </div>
        </div>
    );
}

export default App;
