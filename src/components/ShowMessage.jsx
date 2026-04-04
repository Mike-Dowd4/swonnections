import '../styles/ShowMessage.css'

function ShowMessage( { message, show }) {

    return (
        <>
            <div className={`text-box ${show ? 'show': ''}`}>
                <span className='message-text'>{message}</span>
            </div>
        
        </>
    )
}

export default ShowMessage;
