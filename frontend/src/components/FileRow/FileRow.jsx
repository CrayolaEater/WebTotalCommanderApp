import './fileRow.scss';
import getIcon from "../../helpers/fileIcon";
import backIcon from "../../assets/back icon-min.png";
import Loader from "../Loader/Loader";

function FileRow({isPrevBtn = false, fileInfo}) {

    return (
        <tr className="file-row-container">
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
                                {fileInfo.size}
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