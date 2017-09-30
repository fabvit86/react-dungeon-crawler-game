import React, { Component } from 'react'

class Tile extends Component {
  // constructor (props) {
  //   super(props)
  //   this.status = this.props.tileData.status
  //   this.room = this.props.tileData.room
  // }
    
  render () {
    return (
      <div
        id={this.props.tileData.id}
        className={'tile ' + this.props.tileData.status + ' room' + this.props.tileData.room}
      />
    )
  }
} // Cell class

export default Tile
