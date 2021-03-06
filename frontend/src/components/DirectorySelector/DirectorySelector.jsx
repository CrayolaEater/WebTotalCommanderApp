import './directorySelector.scss';

function DirectorySelector({setValue, value, values, onChange}) {
    return (
        <select name="divSelector" className="dir-selector" value={value.value} onChange={(e) => {
            setValue(values.find(es => es.value === e.target.value));
            onChange();
        }}>
            {
                values && values.length > 0 && values.map((e, i) => (
                    <option key={`#option-${i}`} value={e.value}>{e.key}</option>
                ))
            }
        </select>
    );
}

export default DirectorySelector;