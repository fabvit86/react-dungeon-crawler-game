import React, { Component } from 'react'
import StatusBar from './StatusBar'
import heroImage from './assets/images/game-sprites/human_male.png'
import chestArmorImage from './assets/images/game-sprites/scalemail_2.png'
import legsImage from './assets/images/game-sprites/leg_armor_1.png'
import glovesImage from './assets/images/game-sprites/glove_gray.png'
import helmImage from './assets/images/game-sprites/helm_plume.png'
import swordImage from './assets/images/game-sprites/sword_3.png'
import $ from 'jquery'

class Hero extends Component {
  constructor (props) {
    super(props)
    this.pickedUpItems = []
    this.heroImage = '<img class="gameSprite" id="heroImage" src="'+heroImage+'" alt="hero" />'
    this.state = {
      position: this.props.position, // x and y coordinates
      health: 100,
      maxHealth: 100,
      attack: 10, // increses with weapon item
      level: 1,
      exp: 0,
      nextLvlExp: 15,
      weapon: 'bare fists',
      resistance: 0 // increses with armor items
    }
    this.bound_moveHero = this.moveHero.bind(this) // needed to clean event listener
  }

  componentWillReceiveProps(nextProps) {
    // update initial hero position:
    if (this.state.position.x !== nextProps.position.x || this.state.position.y !== nextProps.position.y) {
      this.setState({ position: nextProps.position })
    }
    // update hero image:
    $('#tile'+nextProps.position.x+'-'+nextProps.position.y).html(this.heroImage)
  }

  componentDidMount () {
    // add event listener:
    window.addEventListener('keydown', this.bound_moveHero, true)
  }

  componentWillUnmount () {
    // clean event listener:
    window.removeEventListener('keydown', this.bound_moveHero, true)
  }

  getPicketUpItem (itemX, itemY) {
    const filteredItems = this.props.items.filter((item) => item.position.x === itemX && item.position.y === itemY)
    return filteredItems[0]
  }

  // check which item has been picked up:
  pickUpItem (itemX, itemY) {
    const pickedItem = this.getPicketUpItem(itemX, itemY)
    this.pickedUpItems.push(pickedItem)
    // increase hero parameters:
    switch (pickedItem.itemType) {
    case 'armor':
      this.setState({resistance: this.state.resistance + pickedItem.resistance })
      this.dressUp()
      break
    case 'weapon':
      this.setState({
        attack: this.state.attack + pickedItem.attack,
        weapon: pickedItem.itemName
      })
      this.dressUp()
      break
    case 'potion': {
      let newHealth = this.state.health + pickedItem.health
      if (newHealth > this.state.maxHealth) {
        newHealth = this.state.maxHealth
      }
      this.setState({ health: newHealth })
      break
    }
    default:
      break
    }
    console.log(this.state) //TEST
  }

  // change hero image based on the item picked up:
  dressUp () {
    this.heroImage = '<img class="gameSprite" id="heroImage" src="'+heroImage+'" alt="hero" />'
    this.pickedUpItems.forEach((element) => {
      let img
      switch (element.itemName) {
      case 'chest armor':
        img = chestArmorImage
        break
      case 'leg armor':
        img = legsImage
        break
      case 'helm':
        img = helmImage
        break
      case 'gloves':
        img = glovesImage
        break
      case 'sword':
        img = swordImage
        break
      default:
        return
      }
      this.heroImage += '<img class="gameSprite" src="' + img +'" alt="'+ element.itemName +'Image"/>'
    })
  }

  // shows a tooltip about the item picked up:
  showItemTooltip (nextX, nextY, newTileSelector) {
    const itemPosition = $(newTileSelector).offset()
    $('#tooltipDiv .tooltip-inner').html('You found ' + this.getPicketUpItem(nextX, nextY).itemName + '!')
    const tooltipDivHeight = $('#tooltipDiv').outerHeight()
    const tooltipDivWidth = $('#tooltipDiv').outerWidth()
    const tooltipTop = itemPosition.top - tooltipDivHeight
    const tooltipLeft = itemPosition.left + $(newTileSelector).outerWidth() / 2 - tooltipDivWidth / 2
    $('#tooltipDiv').css('transform', 'translate3d('+tooltipLeft+'px, '+tooltipTop+'px, 0px)')
    $('#tooltipDiv .arrow').css('left', tooltipDivWidth / 2 + 'px')
    $('#tooltipDiv').addClass('show')
    setTimeout(() => $('#tooltipDiv').removeClass('show'), 600)
  }

  // calculate exp needed to level up:
  nextLvlCalculator (level) {
    return level * (10 + level) + 10
  }

  // calculate damage dealt randomly within a range:
  damageDealtCalculator (baseAttack) {
    const minAttack = baseAttack - 2
    const maxAttack = baseAttack + 2
    return Math.floor(Math.random() * (maxAttack - minAttack) + minAttack)
  }

  fight (enemyX, enemyY) {
    // detect which enemy by its position:
    const filteredEnemies = this.props.enemies.filter((enemy) => enemy.position.x === enemyX && enemy.position.y === enemyY)
    const engagedEnemy = filteredEnemies[0]
    // check enemy's health:
    if (engagedEnemy.health <= 0) {
      return true
    }
    // hero's attack
    engagedEnemy.health -= this.damageDealtCalculator(this.state.attack)
    if (engagedEnemy.health <= 0) { // enemy defeated
      const newXP = this.state.exp + engagedEnemy.givenXP
      // increse hero's exp:
      this.setState({ exp: this.state.exp + engagedEnemy.givenXP })
      // level up:
      if (newXP >= this.state.nextLvlExp) {
        this.setState({ 
          level: this.state.level + 1,
          nextLvlExp: this.nextLvlCalculator(this.state.level + 1),
          attack: this.state.attack + 3,
          resistance: this.state.resistance + 2,
          health: this.state.maxHealth + 5,
          maxHealth: this.state.maxHealth + 5,
          exp: 0
        })
      }
      return true
    }
    // enemy still alive, enemy's attack: 
    else {
      this.setState({ health: this.state.health - (this.damageDealtCalculator(engagedEnemy.attack) - this.state.resistance) })
      $('#heroImage').css('background-color', 'red')
      setTimeout(() => $('#heroImage').css('background-color', 'green'), 50)
      // check hero's health:
      if (this.state.health <= 0) {
        // TODO: game over
      }
      return false
    }
  }

  moveHero (event) {
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
    const oldTileSelector = '#tile'+this.state.position.x+'-'+this.state.position.y
    const newTileSelector = '#tile'+nextX+'-'+nextY
    let moveOn = false
    if (nextX >= 0 && nextY >= 0 && nextX < this.props.rows && nextY < this.props.columns
        && $(newTileSelector).hasClass('roomTile')) {
      // hit the exit door:
      if ($(newTileSelector).hasClass('exitDoor')) {
        this.props.goToFinalDungeon()
      }
      // hit an item chest:
      else if ($(newTileSelector).hasClass('itemTile')) {
        this.pickUpItem(nextX, nextY)
        $(newTileSelector).removeClass('itemTile')
        // tooltip:
        this.showItemTooltip(nextX, nextY, newTileSelector)
        moveOn = true
      }
      // hit an enemy:
      else if ($(newTileSelector).hasClass('enemyTile')) {
        moveOn = this.fight(nextX, nextY)
        if(moveOn) $(newTileSelector).removeClass('enemyTile')
      }
      // goes to a free tile:
      else {
        moveOn = true
      }
      if (moveOn) {
        // remove hero from current tile:
        $(oldTileSelector).removeClass('heroTile')
        $(oldTileSelector + ' img').remove()
        // move hero to next tile:
        $(newTileSelector).addClass('heroTile')
        // update hero image:
        $(newTileSelector).html(this.heroImage)
        // update hero position:
        this.setState({position: {x: nextX, y: nextY} })
      }
    }
    event.preventDefault()
  }

  render () {
    console.log('rendering hero...','hero:',this.state, 'enemies:',this.props.enemies) // TEST
    return (
      <div id='hero'>
        <StatusBar stats={this.state}/>
      </div>
    )
  }
} // Hero class

export default Hero
