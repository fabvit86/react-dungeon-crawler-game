import React, { Component } from 'react'

class Tile extends Component {
  constructor (props) {
    super(props)
  }
    
  render () {
    return (
      <div
        id={this.props.tileData.id}
        className={'tile'}
      />
    )
  }
} // Cell class

export default Tile
