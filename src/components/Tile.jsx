import '../styles/Tile.css';
function Tile(props) {
    return (
        <>
            <div 
            className={`tile ${props.selected ? 'selected' : ''}`}
            onClick={props.onClick}>
                <span className='swimmer-name'>{props.name}</span>
            </div>
        </>
    );
}

export default Tile;