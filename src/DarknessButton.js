import React from 'react'

const DarknessButton = ({toggleDarkness}) => {

  return (
    <button 
      id='darkessButton' 
      className='btn btn-secondary' 
      onClick={toggleDarkness}>
      Show/Hide Map
    </button>
  )
}

export default DarknessButton
