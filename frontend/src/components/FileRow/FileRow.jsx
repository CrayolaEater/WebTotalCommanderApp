import './fileRow.scss';
import getIcon from "../../helpers/fileIcon";
function FileRow({isPrevBtn = false, fileInfo}) {
    return (
        <tr className="file-row-container">
            {
                isPrevBtn ?
                    (
                        <td className="prev-btn" colSpan={"100%"}>
                            ...
                        </td>
                    )
                    :
                    (
                        <>
                            <td className={"file-name-td"}>
                                <img className={"file-icon"} src={getIcon(fileInfo)} alt="icon"/>
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