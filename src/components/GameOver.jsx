import '../styles/GameOver.css';

function GameOver(props) {

    return (
        <>
        <div className={`game-over-container ${props.gameOver && !props.showBoard ? 'show': ''}`}>
            {props.win ? (
                <span>You win!</span>
            ): (
                <span>You ran out of guesses :(</span>
            )}

            <span>Come back tomorrow for a new game!</span>

            <button 
            className='view-board-button'
            onClick={() => props.toggleBoard(true)}>View board</button>
        </div>
        
        
        </>
    )
}

export default GameOver;