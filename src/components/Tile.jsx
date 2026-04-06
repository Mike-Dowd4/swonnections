import '../styles/Tile.css';
function Tile(props) {
    return (
        <>
            <div 
            className={`tile ${props.selected ? 'selected' : '' } ${props.disabled ? 'disabled': ''}`}
            onClick={props.onClick}>
                <span className='swimmer-name'>{props.name}</span>
                <img
                className='swimmer-img'
                src={`/swimmer_images/${props.name.replaceAll(" ", "_")}.webp`}
                onError={(e) => {
                    e.currentTarget.src = "/placeholder.png";
                }}
                />
            </div>
        </>
    );
}

export default Tile;