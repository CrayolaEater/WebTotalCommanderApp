import "./directoriesPanel.scss";
import FileRow from "../FileRow/FileRow";
import {useEffect, useState} from "react";
import Loader from "../Loader/Loader";

function DirectoriesPanel({cd}) {

    const [files, setFiles] = useState([]);
    const [isLoading, toggleLoading] = useState(false);

    useEffect(()=>{
        fetch(process.env.REACT_APP_SERVER_ADRESS + "/bbbn/getFiles/", {
            method: "post",
            headers : {
                "Content-type" : "application/json",
            },
            body: JSON.stringify({path: cd})
        })
            .then(result => result.json())
            .then(data => setFiles(data))
    }, [cd]);

    return (
        <div className="dir-panel-container">
            {isLoading && <Loader />}
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
                    <FileRow isPrevBtn/>
                    {
                        files && files.map((e, i)=> (
                            <FileRow key={`#fileRow-${i}`} fileInfo={e} />
                        ))
                    }
                </tbody>

            </table>}
        </div>
    );
}

export default DirectoriesPanel;