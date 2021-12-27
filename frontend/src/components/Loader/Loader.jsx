import "./loader.scss";
import loaderIcon from '../../assets/loader.gif';
function Loader() {
    return (
        <div className="loader-container">
            <img src={loaderIcon} alt="loader"/>
        </div>
    );
}

export default Loader;