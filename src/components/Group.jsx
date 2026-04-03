import '../styles/Group.css'

function Group(props) {
    const difficultyColors = {
        1: 'rgb(250, 253, 59)',
        2: 'rgb(17, 174, 41)',
        3: 'rgb(106, 184, 230)',
        4: 'rgb(155, 106, 252)'
    };

    return (
        <>
            <div className='correct-group' 
            style={{ backgroundColor: difficultyColors[props.difficulty] }}>
                <div className='group-text'>
                    <span className='group-title'>{props.groupName}</span>
                    <span className='group-swimmers'>
                        { props.names.join(", ") }
                    </span>
                </div>
            </div>
        </>
    )
}

export default Group;