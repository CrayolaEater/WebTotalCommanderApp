import "./modal.scss";

function Modal(props) {
    return (
        <div className="overlay">
            <div className="modal-container">
                <button onClick={props.onClose} className="button modal-close">X</button>
                <div className="modal-body">
                    {props.children}
                </div>
            </div>
        </div>
    );
}

export default Modal;