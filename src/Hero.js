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
      position: this.props.position // x and y coordinates
    }
  }

  componentDidMount () {
    this.moveHero()
  }

  moveHero () {
    window.addEventListener('keydown', (event) => {
      if (event.defaultPrevented) {
        return
      }
      let nextX = this.state.position.x
      let nextY = this.state.position.y
      switch (event.key) {
      case 'ArrowDown':
        nextX = this.state.position.x + 1
        break
      case 'ArrowUp':
        nextX = this.state.position.x - 1
        break
      case 'ArrowLeft':
        nextY = this.state.position.y - 1
        break
      case 'ArrowRight':
        nextY = this.state.position.y + 1
        break
      default:
        return
      }
      console.log('going from',this.state.position.x, this.state.position.y, 'to', nextX, nextY) // TEST
      if (nextX >= 0 && nextY >= 0 && nextX < this.props.rows && nextY < this.props.columns &&
          !$('#tile'+nextX+'-'+nextY).hasClass('occupied') && $('#tile'+nextX+'-'+nextY).hasClass('roomTile')) {
        $('#tile'+this.state.position.x+'-'+this.state.position.y).removeClass('heroTile occupied')
        $('#tile'+nextX+'-'+nextY).addClass('heroTile occupied')
        // update hero position:
        this.setState({position: {x: nextX, y: nextY} })
      }
      event.preventDefault()
    }, true)
  }

  render () {
    console.log('rendering hero') // TEST
    return (
      <div id='hero'></div>
    )
  }
} // Hero class

export default Hero
