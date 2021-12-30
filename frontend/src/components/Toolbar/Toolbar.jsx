import "./toolbar.scss";

function Toolbar(props) {

    return (
        <div className="toolbar-container">
            {props.children}
        </div>
    );
}

export default Toolbar;