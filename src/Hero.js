import React, { Component } from 'react'
import $ from 'jquery'
window.jQuery = $
window.$ = $

class Hero extends Component {
  constructor (props) {
    super(props)
    this.health = 100
    this.level = 1
    this.weapon = 1
    this.state = {
      position: this.props.position
    }
  }

  render () {
    return (
      <div id='hero'></div>
    )
  }
} // Hero class

export default Hero
