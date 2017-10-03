import React, { Component } from 'react'
import heroImage from './assets/images/game-sprites/human_male.png'

class Tile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      occupier: 'none'
    }
  }

  componentWillMount () {
    // check if this tile contains the hero:
    if (this.props.initialHeroPosition.x === this.props.tileData.rowIndex && 
        this.props.initialHeroPosition.y === this.props.tileData.colIndex) {
      this.setState({occupier: 'hero'})
    }
  }

  render () {
    // console.log('rendering tile', this.props.tileData.id) // TEST
    let classes = 'tile ' + this.props.tileData.status + ' room' + this.props.tileData.room
    let img = ''
    if (this.state.occupier === 'hero') {
      classes += ' heroTile occupiedTile'
      img = <img className="gameSprite" id="heroImage" src={heroImage} alt='hero'/>
    }
    return (
      <div
        key={this.props.tileData.id}
        id={'tile'+this.props.tileData.id}
        className={classes}
      >
        {img}
      </div>
    )
  }
} // Cell class

export default Tile
