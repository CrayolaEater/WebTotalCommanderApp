import Modal from "../Modal/Modal";
import {useEffect, useRef, useState} from "react";
import parseError from "../../helpers/parseError";

function NewFileModal({toggleCreateNewFile, getFiles, toggleLoading, cd}) {
    function makeFile() {
        toggleLoading(true);
        fetch(process.env.REACT_APP_SERVER_ADRESS + "/bbbn/mkfile/", {
            method: "post",
            headers: {
                "Content-type": "application.json"
            },
            body: JSON.stringify({name: newFileName, parent: cd})
        })
            .then(result => result.json())
            .then(data => {
                if (data.code === "OK") {
                    getFiles();
                    toggleCreateNewFile(false);
                } else {
                    setError(data.code);
                }
            })
            .finally(() => {
                toggleLoading(false);
            })

    }

    const [newFileName, setNewFileName] = useState("");
    const [error, setError] = useState("");
    const input = useRef(null);

    useEffect(() => {
        if (input) {
            input.current.focus();
        }
    }, [input]);

    return (
        <Modal onClose={() => {
            toggleCreateNewFile(false);
        }}>
            {error && <div className="errorMessage">
                {parseError(error)}
            </div>}
            <form className="new-file-container" onSubmit={(e) => {
                e.preventDefault();
                makeFile();
            }}>
                Create new file
                <input ref={input} value={newFileName} onChange={(e) => setNewFileName(e.target.value)} type="text"
                       required
                       pattern={`^[\\w,\\s-]+\\.[A-Za-z]{3}$`} placeholder={"name..."}
                       className="text-input"/>
                <button className="confirm-btn">
                    Confirm
                </button>
            </form>
        </Modal>
    );
}

export default NewFileModal;