import '../styles/MoreGames.css'

function MoreGames() {

    return (
        <>  
            <div className='more-games-container'>
                <div className='games-container'>
                    <a href="https://swordle.org" style={{display: 'block', textDecoration: 'none', color: 'inherit'}}>
                        <div className='game-rec'>
                            <h3 className='game-rec-title-text'> Try Swordle! (Swimmer Wordle) </h3>

                            <img 
                            src={`${window.location.origin}/swimmer_images/swordle-screenshot.jpg`}
                            className='game-img'/>
                        </div>
                    </a>
                </div>
            </div>
        </>
    )
}

export default MoreGames