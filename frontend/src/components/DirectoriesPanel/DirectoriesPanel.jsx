import "./directoriesPanel.scss";
import FileRow from "../FileRow/FileRow";
import {useEffect, useState} from "react";
import Loader from "../Loader/Loader";
import removeLastFromUrl from "../../helpers/urlManipulator";
import DirectorySelector from "../DirectorySelector/DirectorySelector";

function DirectoriesPanel({cd, setCd, defaultPaths, setDefaultPath, allDefaultPaths}) {

    const [files, setFiles] = useState([]);
    const [isLoading, toggleLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState({path: ""});
    useEffect(() => {
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
                setFiles(data);
                toggleLoading(false);
            })
    }, [cd]);

    return (
        <div className="dir-panel-container">
            <DirectorySelector value={defaultPaths} values={allDefaultPaths} setValue={setDefaultPath}/>
            <input type="text" onChange={(e) => setCd(e.target.value)} value={cd} className={"cd-input"}/>
            {isLoading && <Loader/>}
            {!isLoading && <table className="filesTable">
                <thead>
                <tr className="head-row">
                    <th className="name-head">
                        Name
                    </th>
                    <th className="ext-head">
                        Ext
                    </th>
                    <th className="size-head">
                        Size
                    </th>
                    <th className="date-head">
                        Date
                    </th>
                    <th className="attr-head">
                        Attr
                    </th>
                </tr>
                </thead>

                <tbody>
                <FileRow onClick={() => {
                    setCd(removeLastFromUrl(cd, defaultPaths.value));
                }
                } isPrevBtn/>
                {
                    files && files.map((e, i) => (
                        <FileRow selected={e.path === selectedFile.path} onClick={() => {
                            if (selectedFile.path !== e.path) {
                                setSelectedFile(e);
                            } else if (e.path === selectedFile.path) {
                                if (e.isDir) {
                                    setSelectedFile({path: ""});
                                    setCd(e.path);
                                }
                            }
                        }} key={`#fileRow-${i}`} fileInfo={e}/>
                    ))
                }
                </tbody>

            </table>}
        </div>
    );
}

export default DirectoriesPanel;