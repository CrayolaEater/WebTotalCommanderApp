import './fileRow.scss';
import getIcon from "../../helpers/fileIcon";
import backIcon from "../../assets/back icon-min.png";

function FileRow({isPrevBtn = false, fileInfo, onClick}) {

    return (
        <tr className="file-row-container" onClick={onClick}>
            {
                isPrevBtn ?
                    (
                        <>
                            <td className="prev-btn" colSpan={"100%"}>
                                <img src={backIcon} alt="back" className="back-icon"/>
                                ...
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </>

                    )
                    :
                    (
                        <>
                            <td className={"file-name-td"}>
                                <img className={"file-icon"} src={getIcon(fileInfo, fileInfo.ext)} alt="icon"/>
                                {fileInfo.name}
                            </td>
                            <td>
                                {fileInfo.ext}
                            </td>
                            <td>
                                {fileInfo.isDir ? "" : fileInfo.size}
                            </td>
                            <td>
                                {fileInfo.date}
                            </td>
                            <td>
                                {fileInfo.attr}
                            </td>
                        </>
                    )
            }
        </tr>
    );
}

export default FileRow;