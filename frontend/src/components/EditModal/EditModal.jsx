import Modal from "../Modal/Modal";
import {useEffect, useState} from "react";
import "./editModal.scss";

function EditModal({filePath, onClose}) {

    const [error, setError] = useState(false);
    const [value, setValue] = useState("");
    const [saved, toggleSaved] = useState(false);

    function getFileContent() {
        fetch(process.env.REACT_APP_SERVER_ADRESS + "/bbbn/getFileContent/", {
            method: "post",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({filePath: filePath})
        })
            .then(result => result.json())
            .then(data => {
                if (data.code === "OK") {
                    setValue(data.data);
                } else {
                    setError(true);
                }
            });
    }

    function setFileContent() {
        fetch(process.env.REACT_APP_SERVER_ADRESS + "/bbbn/setFileContent/", {
            method: "post",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({filePath: filePath, data: value})
        })
            .then(result => result.json())
            .then(data => {
                if (data.code === "OK") {
                    toggleSaved(true);
                } else {
                    setError(true);
                }
            });
    }

    useEffect(() => {
        getFileContent();
    }, []);

    return (
        <Modal onClose={onClose}>
            <div className="editFileContainer">
                Now Editing {filePath}
            </div>
            <textarea value={value} onChange={e => {
                setValue(e.target.value);
                toggleSaved && toggleSaved(false);
            }} className={"fileContent"} name="file" id="content" cols="70" rows="30">

            </textarea>

            {saved && <div className="savedText">Saved successfully!</div>}
            {error && <div className="errorMessage">An error occured.</div>}

            <div className="buttonsContainer">
                <button className="confirm-btn" onClick={setFileContent}>Save</button>
                <button className="confirm-btn close-btn" onClick={onClose}>Close</button>
            </div>
        </Modal>
    );
}

export default EditModal;