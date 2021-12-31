import './App.css';
import Toolbar from "./components/Toolbar/Toolbar";
import DirectoriesPanel from "./components/DirectoriesPanel/DirectoriesPanel";
import React, {useEffect, useRef, useState} from "react";
import newFolderIcon from "./assets/new-folder-icon.png";
import newFileIcon from "./assets/new-file-icon.png";
import deleteIcon from "./assets/delete-icon.png";
import copyIcon from "./assets/copy-icon.png";
import cutIcon from "./assets/cut-file-icon.png";
import VerificationModal from "./components/VerificationModal/VerificationModal";
import ActionElement from "./components/ActionElement/ActionElement";

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
    const selectedFilesAndPanel = useRef(null);
    const [infoModal, setInfoModal] = useState(null);
    const action = useRef(null);


    function deleteFiles() {
        toggleLoading(true);
        fetch(process.env.REACT_APP_SERVER_ADRESS + "/bbbn/rmFiles/", {
            method: "post",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({paths: selectedFilesAndPanel.current.files})
        })
            .then(result => result.json())
            .then(data => {
                if (data.code === "OK") {
                    selectedFilesAndPanel.current = null;
                }
            })
            .finally(() => {
                setInfoModal(null);
                toggleLoading(false);
                action.current = null;
            });
    }

    function copyFiles(overwrite = false) {
        toggleLoading(true);
        const source = selectedFilesAndPanel.current.panel === 1 ? rightPanelCd : leftPanelCd;
        fetch(process.env.REACT_APP_SERVER_ADRESS + "/bbbn/copyFiles/", {
            method: "post",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({source: source, files: selectedFilesAndPanel.current.files, overwrite: overwrite})
        })
            .then(restult => restult.json())
            .then(data => {
                if (data.code === "OK") {
                    if (data.overwritten.length > 0) {
                        setInfoModal(
                            <div>
                                The following files will be overwritten:
                                <ul>
                                    {data.overwritten.map((e, i) => (
                                        <li key={`#list-${i}`}>{e}</li>
                                    ))}
                                </ul>
                            </div>
                        );
                        action.current = () => {
                            copyFiles(true);
                        };
                    } else {
                        setInfoModal(null);
                        action.current = null;
                    }
                }
            })
            .finally(() => {
                toggleLoading(false);
            })
    }

    function moveFiles(overwrite = false) {
        toggleLoading(true);
        const source = selectedFilesAndPanel.current.panel === 1 ? rightPanelCd : leftPanelCd;
        fetch(process.env.REACT_APP_SERVER_ADRESS + "/bbbn/cutFiles/", {
            method: "post",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({source: source, files: selectedFilesAndPanel.current.files, overwrite: overwrite})
        })
            .then(restult => restult.json())
            .then(data => {
                if (data.code === "OK") {
                    if (data.overwritten.length > 0) {
                        setInfoModal(
                            <div>
                                The following files will be overwritten:
                                <ul>
                                    {data.overwritten.map((e, i) => (
                                        <li key={`#list-${i}`}>{e}</li>
                                    ))}
                                </ul>
                            </div>
                        );
                        action.current = () => {
                            moveFiles(true);
                        };
                    } else {
                        setInfoModal(null);
                        action.current = null;
                    }
                }
            })
            .finally(() => {
                toggleLoading(false);
            })
    }

    useEffect(() => {
        fetch(process.env.REACT_APP_SERVER_ADRESS + "/bbbn/getDefaultPaths/")
            .then(result => result.json())
            .then(data => {
                setDefaultPaths(data);
                setLeftDefaultPath(data[0]);
                setRightDefaultPath(data[0]);
                toggleLoading(false);
            });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Delete" && selectedFilesAndPanel.current && selectedFilesAndPanel.current.files.length > 0) {
                setInfoModal(() => (<div>Are you sure you want to
                    delete <strong>{selectedFilesAndPanel.current.files.length} items?</strong></div>));
                action.current = deleteFiles;
            }
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
                <button title={"New Directory"} onClick={() => {
                    toggleCreateNewFolder(true);
                }} className="button new-folder-btn">
                    <img src={newFolderIcon} alt="new folder"/>
                </button>

                <button title={"New File"} onClick={() => {
                    toggleCreateNewFile(true);
                }} className="button new-file-btn">
                    <img src={newFileIcon} alt="new file"/>
                </button>


                <button title={"Delete"} onClick={() => {
                    if (selectedFilesAndPanel.current && selectedFilesAndPanel.current.files.length > 0) {
                        setInfoModal(() => (<div>Are you sure you want to
                            delete <strong>{selectedFilesAndPanel.current.files.length} items?</strong></div>));
                        action.current = deleteFiles;
                    }
                }} className="button delete-btn">
                    <img src={deleteIcon} alt="delete"/>
                </button>

                <button title={"Copy"} onClick={() => {
                    if (selectedFilesAndPanel.current && selectedFilesAndPanel.current.files.length > 0) {
                        setInfoModal(() => <ActionElement left={leftPanelCd} right={rightPanelCd}
                                                          fromPanel={selectedFilesAndPanel.current.panel}
                                                          message={<div>Are you sure you want
                                                              to <strong>copy {selectedFilesAndPanel.current.files.length} items
                                                                  ?</strong></div>}/>);
                        action.current = copyFiles;
                    }
                }} className="button delete-btn">
                    <img src={copyIcon} alt="delete"/>
                </button>

                <button title={"Cut"} onClick={() => {
                    if (selectedFilesAndPanel.current && selectedFilesAndPanel.current.files.length > 0) {
                        setInfoModal(() => <ActionElement left={leftPanelCd} right={rightPanelCd}
                                                          fromPanel={selectedFilesAndPanel.current.panel}
                                                          message={<div>Are you sure you want
                                                              to <strong>move {selectedFilesAndPanel.current.files.length} items
                                                                  ?</strong></div>}/>);
                        action.current = moveFiles;
                    }
                }} className="button delete-btn">
                    <img src={cutIcon} alt="delete"/>
                </button>


            </Toolbar>
            {infoModal &&
            <VerificationModal onAccept={action.current} message={infoModal} onCancel={() => {
                setInfoModal(null);
                action.current = null;
            }}/>}
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
                                          selectedFilesAndPanel={selectedFilesAndPanel}
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
                                          selectedFilesAndPanel={selectedFilesAndPanel}
                        />

                    </>
                }

            </div>
        </div>
    );
}

export default App;
