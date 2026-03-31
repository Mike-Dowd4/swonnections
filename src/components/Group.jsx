import '../styles/Group.css'

function Group(props) {
    const backgroundColor = props.difficulty;
    return (
        <>
            <div className='correct-group' 
            style={{ backgroundColor: backgroundColor }}>
                <span className='group-title'>{props.groupName}</span>
            </div>
        </>
    )
}

export default Group;