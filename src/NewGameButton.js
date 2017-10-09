import React from 'react'

const NewGameButton = ({newGame}) => {
  return (
    <button 
      className='btn btn-primary'
      onClick={newGame}>
    New Game
    </button>
  )
}

export default NewGameButton
