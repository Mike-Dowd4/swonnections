import '../styles/Group.css'

function Group(props) {
    const difficultyColors = {
        1: 'yellow',
        2: 'green',
        3: 'blue',
        4: 'purple'
    };

    return (
        <>
            <div className='correct-group' 
            style={{ backgroundColor: difficultyColors[props.difficulty] }}>
                <span className='group-title'>{props.groupName}</span>
            </div>
        </>
    )
}

export default Group;