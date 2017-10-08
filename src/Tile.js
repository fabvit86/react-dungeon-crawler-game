import React, { Component } from 'react'
import heroImage from './assets/images/game-sprites/human_male.png'
import treasureChestImage from './assets/images/game-sprites/chest.png'
import potionImage from './assets/images/game-sprites/potion.png'
import smallEnemyImage from './assets/images/game-sprites/enemy_small.png'
import medEnemyImage from './assets/images/game-sprites/enemy_med.png'
import largeEnemyImage from './assets/images/game-sprites/enemy_large.png'
import bossEnemyImage from './assets/images/game-sprites/boss.png'
import doorImage from './assets/images/game-sprites/runed_door.png'

class Tile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      occupier: this.props.tileData.occupier,
      darkness: this.props.darkness
    }
  }

  // check if this tile is within the hero's line of sight:
  isNearHero () {
    const xOffset = Math.abs(this.props.heroPosition.x - this.props.tileData.rowIndex)
    const yOffset = Math.abs(this.props.heroPosition.y - this.props.tileData.colIndex)
    if(xOffset < this.props.lineOfSight && yOffset < this.props.lineOfSight) {
      return true
    }
    return false
  }

  render () {
    let classes = 'tile ' + this.props.tileData.status + ' room' + this.props.tileData.room
    let img
    switch (this.state.occupier) {
    case 'hero':
      classes += ' heroTile'
      img = <img className="gameSprite" id="heroImage" src={heroImage} alt='hero'/>
      break
    case 'item':
      classes += ' itemTile'
      img = <img className="gameSprite chestImage" src={treasureChestImage} alt='chest'/>
      break
    case 'potion':
      classes += ' itemTile'
      img = <img className="gameSprite potionImage" src={potionImage} alt='potion'/>
      break
    case 'smallEnemy':
      classes += ' enemyTile'
      img = <img className="gameSprite enemyImage" src={smallEnemyImage} alt='smallEnemy'/>
      break
    case 'medEnemy':
      classes += ' enemyTile'
      img = <img className="gameSprite enemyImage" src={medEnemyImage} alt='medEnemy'/>
      break
    case 'largeEnemy':
      classes += ' enemyTile'
      img = <img className="gameSprite enemyImage" src={largeEnemyImage} alt='largeEnemy'/>
      break
    case 'bossEnemy':
      classes += ' enemyTile'
      img = <img className="gameSprite enemyImage" src={bossEnemyImage} alt='bossEnemy'/>
      break
    case 'exitDoor':
      classes += ' exitDoor'
      img = <img className="gameSprite doorImage" src={doorImage} alt='door'/>
      break
    default:
      break
    }
    if (this.state.darkness && this.state.occupier !== 'hero' && !this.isNearHero()) {
      classes += ' darkness'
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
