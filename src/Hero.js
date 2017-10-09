import React, { Component } from 'react'
import StatusBar from './StatusBar'
import DarknessButton from './DarknessButton'
import NewGameButton from './NewGameButton'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import $ from 'jquery'

class Hero extends Component {
  constructor (props) {
    super(props)
    this.pickedUpItems = this.props.heroItems
    this.state = {
      position: this.props.position, // x and y coordinates
      heroStats: this.props.heroStats,
      showModal: false
    }
    this.bound_moveHero = this.moveHero.bind(this) // needed to clean event listener
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
    let heroStats = this.state.heroStats
    switch (pickedItem.itemType) {
    case 'armor':
      heroStats.resistance = this.state.heroStats.resistance + pickedItem.resistance
      this.setState({heroStats: heroStats})
      break
    case 'weapon':
      heroStats.attack = this.state.heroStats.attack + pickedItem.attack
      heroStats.weapon = pickedItem.itemName
      this.setState({heroStats: heroStats})
      break
    case 'potion': {
      let newHealth = this.state.heroStats.health + pickedItem.health
      if (newHealth > this.state.heroStats.maxHealth) {
        newHealth = this.state.heroStats.maxHealth
      }
      heroStats.health = newHealth
      this.setState({heroStats: heroStats})
      break
    }
    default:
      break
    }
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
    engagedEnemy.health -= this.damageDealtCalculator(this.state.heroStats.attack)
    let heroStats = this.state.heroStats
    if (engagedEnemy.health <= 0) { // enemy defeated
      const newXP = this.state.heroStats.exp + engagedEnemy.givenXP
      // increse hero's exp:
      heroStats.exp = newXP
      // level up:
      if (newXP >= this.state.heroStats.nextLvlExp) {
        heroStats.level = this.state.heroStats.level + 1
        heroStats.nextLvlExp = this.nextLvlCalculator(this.state.heroStats.level + 1)
        heroStats.attack = this.state.heroStats.attack + 3
        heroStats.resistance = this.state.heroStats.resistance + 2
        heroStats.health = this.state.heroStats.maxHealth + 5
        heroStats.maxHealth = this.state.heroStats.maxHealth + 5
        heroStats.exp = 0
      }
      if (engagedEnemy.enemyType === 'bossEnemy') {
        // final boss defeated:
        this.toggleModal()
        return true
      }
      this.setState({heroStats: heroStats})
      return true
    }
    // enemy still alive, enemy's attack: 
    else {
      heroStats.health = this.state.heroStats.health - (this.damageDealtCalculator(engagedEnemy.attack) - this.state.heroStats.resistance)
      this.setState({heroStats: heroStats})
      $('#heroImage').css('background-color', 'red')
      setTimeout(() => $('#heroImage').css('background-color', 'green'), 50)
      // check hero's health:
      if (this.state.heroStats.health <= 0) {
        // Game Over:
        this.toggleModal()
      }
      return false
    }
  }

  // udpate the line of sight of the hero:
  // updateDarkness (keyPressed, nextX, nextY) {
  //   const toogleDarknessClass = (stillVal, changeIndex, indexMaxVal, action, type) => {
  //     for(let i = changeIndex - this.props.lineOfSight + 1; i < changeIndex + this.props.lineOfSight; i++) {
  //       if (i >= 0 && i <= indexMaxVal){
  //         let identifier
  //         type === 'row' 
  //           ? identifier = ('#tile'+stillVal+'-'+i) 
  //           : identifier = ('#tile'+i+'-'+stillVal)
  //         action === 'remove' 
  //           ? $(identifier).removeClass('darkness') 
  //           : $(identifier).addClass('darkness')
  //       }
  //     }
  //   }
  //   if (this.props.darkness) {
  //     let xToLight, xToDark, yToLight, yToDark, minToCompare, maxToCompare, minAction, maxAction
  //     switch (keyPressed) {
  //     case 'ArrowDown':
  //     case 'ArrowUp':
  //       if (keyPressed === 'ArrowDown') {
  //         xToLight = nextX + this.props.lineOfSight - 1
  //         xToDark = nextX - this.props.lineOfSight
  //         minToCompare = xToDark
  //         maxToCompare = xToLight
  //         minAction = 'add'
  //         maxAction = 'remove'
  //       } else {
  //         xToLight = nextX - this.props.lineOfSight + 1
  //         xToDark = nextX + this.props.lineOfSight
  //         minToCompare = xToLight
  //         maxToCompare = xToDark
  //         minAction = 'remove'
  //         maxAction = 'add'
  //       }
  //       if (maxToCompare < this.props.rows) {
  //         toogleDarknessClass(maxToCompare, nextY, this.props.columns, maxAction, 'row')
  //       }
  //       if (minToCompare >= 0) {
  //         toogleDarknessClass(minToCompare, nextY, this.props.columns, minAction, 'row')
  //       }
  //       break
  //     case 'ArrowLeft':
  //     case 'ArrowRight':
  //       if (keyPressed === 'ArrowLeft') {
  //         yToLight = nextY - this.props.lineOfSight + 1
  //         yToDark = nextY + this.props.lineOfSight
  //         minToCompare = yToLight
  //         maxToCompare = yToDark
  //         minAction = 'remove'
  //         maxAction = 'add'
  //       } else {
  //         yToLight = nextY + this.props.lineOfSight - 1
  //         yToDark = nextY - this.props.lineOfSight
  //         minToCompare = yToDark
  //         maxToCompare = yToLight
  //         minAction = 'add'
  //         maxAction = 'remove'
  //       }
  //       if (minToCompare >= 0) {
  //         toogleDarknessClass(minToCompare, nextX, this.props.rows, minAction, 'column')
  //       }
  //       if (maxToCompare < this.props.columns) {
  //         toogleDarknessClass(maxToCompare, nextX, this.props.rows, maxAction, 'column')
  //       }
  //       break
  //     default:
  //       return
  //     }
  //   }
  // }

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
    const newTileSelector = '#tile'+nextX+'-'+nextY
    let moveOn = false
    if (nextX >= 0 && nextY >= 0 && nextX < this.props.rows && nextY < this.props.columns
        && $(newTileSelector).hasClass('roomTile')) {
      // hit the exit door:
      if ($(newTileSelector).hasClass('exitDoor')) {
        this.props.goToFinalDungeon(this.state.heroStats, this.pickedUpItems)
      }
      // hit an item chest:
      else if ($(newTileSelector).hasClass('itemTile')) {
        this.pickUpItem(nextX, nextY)
        // tooltip:
        this.showItemTooltip(nextX, nextY, newTileSelector)
        moveOn = true
      }
      // hit an enemy:
      else if ($(newTileSelector).hasClass('enemyTile')) {
        moveOn = this.fight(nextX, nextY)
        if(moveOn){ 
          $(newTileSelector).removeClass('enemyTile')
        }
      }
      // goes to a free tile:
      else {
        moveOn = true
      }
      if (moveOn) {
        // center the view:
        this.props.centerViewToHero()
        // send new hero info to the parent:
        this.props.updateHeroToParent({x: nextX, y: nextY}, this.state.position, this.pickedUpItems)
        // update hero position:
        this.setState({position: {x: nextX, y: nextY} })
      }
    }
    event.preventDefault()
  }

  toggleModal () {
    window.removeEventListener('keydown', this.bound_moveHero, true)
    this.setState({ showModal: !this.state.showModal })
  }

  render () {
    let modalTitle, modalBody
    if (this.state.heroStats.health <= 0) {
      modalTitle = 'You Died!'
      modalBody = 'Try searching for treasure chests to acquire gear and fight more monsters to level up.'
    } else {
      modalTitle = 'You beat the final Boss! Congratulation!'
      modalBody = 'Now go take a shower, you stink of demon\' flash.'
    }
    return (
      <div id='hero'>
        <StatusBar stats={this.state.heroStats}/>
        <DarknessButton 
          toggleDarkness={this.props.toggleDarkness} 
        />
        &nbsp;
        <NewGameButton 
          newGame={this.props.startNewGame} 
        />
        <Modal isOpen={this.state.showModal} toggle={this.toggleModal.bind(this)} className='myModal'>
          <ModalHeader toggle={this.toggleModal.bind(this)}>{modalTitle}</ModalHeader>
          <ModalBody>
            <p>{modalBody}</p>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={this.props.startNewGame}>New Game</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
} // Hero class

export default Hero
