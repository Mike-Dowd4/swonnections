import '../styles/GameOver.css';

function GameOver(props) {

    const handleViewBoard = () => {

    }


    return (
        <>
        <div className='game-over-container'>
            {props.win ? (
                <span>You win!</span>
            ): (
                <span>You ran out of guesses :(</span>
            )}

            <button 
            className='view-board-button'
            onClick={() => props.toggleBoard(true)}>View board</button>
        </div>
        
        
        </>
    )
}

export default GameOver;