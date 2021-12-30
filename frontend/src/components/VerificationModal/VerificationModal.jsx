import Modal from "../Modal/Modal";

function VerificationModal({onAccept, onCancel, message}) {

    return (
        <Modal onClose={onCancel}>
            <form className="new-file-container" onSubmit={(e) => {
                e.preventDefault();
                onAccept();
            }}>
                <div className="message-container">
                    {message}
                </div>
                <div className="buttonsContainer">
                    <button className="confirm-btn">
                        Confirm
                    </button>
                    <button className="confirm-btn close-btn" onClick={onCancel}>
                        Close
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default VerificationModal;