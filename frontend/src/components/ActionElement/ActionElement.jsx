import './actionElement.scss';
import arrowIcon from "../../assets/arrow.png";

function ActionElement({fromPanel, left, right, message}) {
    return (
        <div className="action-container">
            <div className="confirm-msj">{message}</div>
            <div className="action-wrapper">
                <div className="from-path">{left}</div>
                <img className={`arrow-icon ${fromPanel === 2 ? "reversed" : ""}`} src={arrowIcon} alt="arrow"/>
                <div className="to-path">{right}</div>
            </div>
        </div>
    );
}

export default ActionElement;