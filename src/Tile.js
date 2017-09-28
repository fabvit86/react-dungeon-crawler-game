import React, { Component } from 'react'

class Tile extends Component {
  constructor (props) {
    super(props)
    this.status = this.props.tileData.status
  }
    
  render () {
    return (
      <div
        id={this.props.tileData.id}
        className={'tile ' + this.status}
      />
    )
  }
} // Cell class

export default Tile
