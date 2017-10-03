import React, { Component } from 'react'

class Item extends Component {
  constructor (props) {
    super(props)
    this.type = this.props.itemData.itemType
    this.name = this.props.itemData.itemName
    this.position = this.props.itemData.position
  }

  render () {
    return (
      <div className='item'></div>
    )
  }
} // Item Class

export default Item
