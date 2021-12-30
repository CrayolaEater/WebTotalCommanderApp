import "./directoriesPanel.scss";
import FileRow from "../FileRow/FileRow";
import {useEffect, useState} from "react";
import Loader from "../Loader/Loader";
import removeLastFromUrl from "../../helpers/urlManipulator";
import DirectorySelector from "../DirectorySelector/DirectorySelector";
import NewFolderModal from "../NewFolderModal/NewFolderModal";
import NewFileModal from "../NewFileModal/NewFileModal";
import ErrorModal from "../ErrorModal/ErrorModal";

function DirectoriesPanel({
                              cd,
                              setCd,
                              defaultPaths,
                              setDefaultPath,
                              allDefaultPaths,
                              setFocusedPanel,
                              newFolder,
                              toggleCreateNewFolder,
                              panelIndex,
                              newFile,
                              toggleCreateNewFile,
                          }) {

    const [files, setFiles] = useState([]);
    const [isLoading, toggleLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [ctrPressed, toggleCtrl] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        document.addEventListener("keydown", (e) => {
            if (e.key === "Control") {
                toggleCtrl(true);
            }
        });

        document.addEventListener("keyup", (e) => {
            if (e.key === "Control") {
                toggleCtrl(false);
            }
        })
    }, [])

    function getFiles() {
        if (!cd) {
            return;
        }
        toggleLoading(true);
        fetch(process.env.REACT_APP_SERVER_ADRESS + "/bbbn/getFiles/", {
            method: "post",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({path: cd})
        })
            .then(result => result.json())
            .then(data => {
                if (data.code === "OK") {
                    setFiles(data.files);
                } else {
                    setError(data.code);
                }
                toggleLoading(false);
            })
            .finally(() => {
                toggleLoading(false);
            })
        ;
    }


    useEffect(() => {
        getFiles();
    }, [cd]);

    return (
        <div className="dir-panel-container">
            {error && <ErrorModal error={error} onClose={() => {
                setError("");
                setCd(removeLastFromUrl(cd, defaultPaths.value));
            }}/>}
            {newFolder && <NewFolderModal toggleCreateNewFolder={toggleCreateNewFolder} cd={cd} getFiles={getFiles}
                                          toggleLoading={toggleLoading}/>}
            {newFile && <NewFileModal toggleCreateNewFile={toggleCreateNewFile} cd={cd} getFiles={getFiles}
                                      toggleLoading={toggleLoading}/>}
            <DirectorySelector onChange={() => {
                setFocusedPanel(panelIndex);
            }} value={defaultPaths} values={allDefaultPaths} setValue={setDefaultPath}/>
            <input type="text" onChange={(e) => {
                setCd(e.target.value);
                setFocusedPanel(panelIndex);
            }
            } value={cd} className={"cd-input"}/>
            {isLoading && <Loader/>}

            <div>
                {!isLoading && <div className="filesTable">
                    <div className={"thead"}>
                        <div className="tr head-row">
                            <div className="th name-head">
                                Name
                            </div>
                            <div className="th ext-head">
                                Ext
                            </div>
                            <div className="th size-head">
                                Size
                            </div>
                            <div className="th date-head">
                                Date
                            </div>
                            <div className="th attr-head">
                                Attr
                            </div>
                        </div>
                        <FileRow onClick={() => {
                            setCd(removeLastFromUrl(cd, defaultPaths.value));
                            setFocusedPanel(panelIndex);
                        }
                        } isPrevBtn/>
                    </div>
                    <div className={"tbody"}>
                        {
                            files && files.map((e, i) => (
                                <FileRow selected={!!selectedFiles.find(f => f.path === e.path)} onClick={() => {
                                    setFocusedPanel(panelIndex);
                                    if (!!!selectedFiles.find(f => f.path === e.path) || selectedFiles.length === 0) {
                                        console.log("aici1")
                                        if (ctrPressed) {
                                            setSelectedFiles([...selectedFiles, e]);
                                        } else {
                                            setSelectedFiles([e]);
                                        }
                                    } else if (!!selectedFiles.find(f => f.path === e.path) && selectedFiles.length > 1) {
                                        if (ctrPressed) {
                                            let copy = [...selectedFiles];
                                            copy = copy.filter(ef => ef.path !== e.path);
                                            setSelectedFiles(copy);
                                        }
                                    } else if (selectedFiles.length === 1 && selectedFiles[0].path === e.path) {
                                        console.log("aici3")
                                        if (e.isDir) {
                                            setSelectedFiles([]);
                                            setCd(e.path);
                                        }
                                    }
                                }} key={`#fileRow-${i}`} fileInfo={e}/>
                            ))
                        }
                    </div>

                </div>}
            </div>
        </div>
    );
}

export default DirectoriesPanel;