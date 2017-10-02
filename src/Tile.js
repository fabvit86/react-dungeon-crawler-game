import React, { Component } from 'react'

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
    let classes = 'tile ' + this.props.tileData.status + ' room' + this.props.tileData.room
    if (this.state.occupier === 'hero') {
      classes += ' heroTile occupiedTile'
    }
    console.log('rendering tile', this.props.tileData.id) // TEST
    return (
      <div
        key={this.props.tileData.id}
        id={'tile'+this.props.tileData.id}
        className={classes}
      />
    )
  }
} // Cell class

export default Tile
