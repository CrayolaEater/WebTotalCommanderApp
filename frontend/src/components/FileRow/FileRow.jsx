import './fileRow.scss';
import getIcon from "../../helpers/fileIcon";
import backIcon from "../../assets/back icon-min.png";

function FileRow({isPrevBtn = false, fileInfo, onClick, selected = false}) {

    return (
        <div className={`tr file-row-container ${selected && !isPrevBtn ? "selected" : ""}`} onClick={onClick}>
            {
                isPrevBtn ?
                    (
                        <>
                            <div className="td prev-btn">
                                <img src={backIcon} alt="back" className="back-icon"/>
                                ...
                            </div>
                        </>

                    )
                    :
                    (
                        <>
                            <div className={"td file-name-td name-head"}>
                                <img className={"file-icon"} src={getIcon(fileInfo, fileInfo.ext)} alt="icon"/>
                                {fileInfo.name}
                            </div>
                            <div className={"td ext-head"}>
                                {fileInfo.ext}
                            </div>
                            <div className={"td size-head"}>
                                {fileInfo.size === 0 ? "" : fileInfo.size}
                            </div>
                            <div className={"td date-head"}>
                                {new Date(fileInfo.date).toLocaleDateString()}
                            </div>
                            <div className={"td attr-head"}>
                                {fileInfo.attr}
                            </div>
                        </>
                    )
            }
        </div>
    );
}

export default FileRow;