import Modal from "../Modal/Modal";
import parseError from "../../helpers/parseError";

function ErrorModal({error, onClose}) {

    return (
        <Modal onClose={onClose}>
            {error && <div className="errorMessage">
                {parseError(error)}
            </div>}
        </Modal>
    );
}

export default ErrorModal;