import React, { Component } from 'react'
import heroImage from './assets/images/game-sprites/human_male.png'
import chestImage from './assets/images/game-sprites/chest.png'

class Tile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      occupier: this.props.tileData.occupier
    }
  }

  render () {
    // console.log('rendering tile', this.props.tileData.id) // TEST
    let classes = 'tile ' + this.props.tileData.status + ' room' + this.props.tileData.room
    let img = ''
    if (this.state.occupier === 'hero') {
      classes += ' heroTile occupiedTile'
      img = <img className="gameSprite" id="heroImage" src={heroImage} alt='hero'/>
    } else if (this.state.occupier === 'item') {
      classes += ' itemTile occupiedTile'
      img = <img className="gameSprite" id="chestImage" src={chestImage} alt='chest'/>
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
