import React, { Component } from 'react'
import heroImage from './assets/images/game-sprites/human_male.png'
import treasureChestImage from './assets/images/game-sprites/chest.png'
import potionImage from './assets/images/game-sprites/potion.png'
import smallEnemyImage from './assets/images/game-sprites/enemy_small.png'
import medEnemyImage from './assets/images/game-sprites/enemy_med.png'
import largeEnemyImage from './assets/images/game-sprites/enemy_large.png'
import bossEnemyImage from './assets/images/game-sprites/boss.png'
import doorImage from './assets/images/game-sprites/runed_door.png'
import chestArmorImage from './assets/images/game-sprites/scalemail_2.png'
import legsImage from './assets/images/game-sprites/leg_armor_1.png'
import glovesImage from './assets/images/game-sprites/glove_gray.png'
import helmImage from './assets/images/game-sprites/helm_plume.png'
import swordImage from './assets/images/game-sprites/sword_3.png'

class Tile extends Component {

  shouldComponentUpdate (nextProps) {
    // re-render every tile if darkness is toggled:
    if (this.props.darkness !== nextProps.darkness) {
      return true
    }
    // update tiles part of the hero's line of sight:
    if (this.props.darkness && this.isNearHero(nextProps.heroPosition, true)){
      return true
    }
    // render only the tile that had the hero and the tile that now has the hero:
    if ((nextProps.heroPosition.x === nextProps.tileData.rowIndex 
        && nextProps.heroPosition.y === nextProps.tileData.colIndex)
        ||
        (nextProps.oldHeroPosition.x === nextProps.tileData.rowIndex
        && nextProps.oldHeroPosition.y === nextProps.tileData.colIndex)){
      return true
    }
    return false
  }

  // check if this tile is within the hero's line of sight:
  isNearHero (heroPosition, extraBorder) {
    const xOffset = Math.abs(heroPosition.x - this.props.tileData.rowIndex)
    const yOffset = Math.abs(heroPosition.y - this.props.tileData.colIndex)
    let rangeX = this.props.lineOfSight
    let rangeY = this.props.lineOfSight
    if (extraBorder) { // consider also one extra row and columns outside line of sight
      rangeX++
      rangeY++
    }
    if(xOffset < rangeX && yOffset < rangeY) {
      return true
    }
    return false
  }

  render () {
    let classes = 'tile ' + this.props.tileData.status + ' room' + this.props.tileData.room
    let img = []
    switch (this.props.tileData.occupier) {
    case 'hero':
      classes += ' heroTile'
      img.push(<img key='heroImage' className="gameSprite" id="heroImage" src={heroImage} alt="hero"/>)
      ;for (let i = 0; i < this.props.heroItems.length;i++) {
        const currentItem = this.props.heroItems[i]
        switch (currentItem.itemName) {
        case 'chest armor':
          img.push(<img key={i} className="gameSprite" src={chestArmorImage} alt={this.props.heroItems[i].itemName}/>)
          break
        case 'leg armor':
          img.push(<img key={i} className="gameSprite" src={legsImage} alt={this.props.heroItems[i].itemName}/>)
          break
        case 'helm':
          img.push(<img key={i} className="gameSprite" src={helmImage} alt={this.props.heroItems[i].itemName}/>)
          break
        case 'gloves':
          img.push(<img key={i} className="gameSprite" src={glovesImage} alt={this.props.heroItems[i].itemName}/>)
          break
        case 'sword':
          img.push(<img key={i} className="gameSprite" src={swordImage} alt={this.props.heroItems[i].itemName}/>)
          break
        default:
          break
        }
      }
      break
    case 'item':
      classes += ' itemTile'
      img.push(<img key='chestImage' className="gameSprite chestImage" src={treasureChestImage} alt='chest'/>)
      break
    case 'potion':
      classes += ' itemTile'
      img.push(<img key='potion' className="gameSprite potionImage" src={potionImage} alt='potion'/>)
      break
    case 'smallEnemy':
      classes += ' enemyTile'
      img.push(<img key='smallEnemy' className="gameSprite enemyImage" src={smallEnemyImage} alt='smallEnemy'/>)
      break
    case 'medEnemy':
      classes += ' enemyTile'
      img.push(<img key='medEnemy' className="gameSprite enemyImage" src={medEnemyImage} alt='medEnemy'/>)
      break
    case 'largeEnemy':
      classes += ' enemyTile'
      img.push(<img key='largeEnemy' className="gameSprite enemyImage" src={largeEnemyImage} alt='largeEnemy'/>)
      break
    case 'bossEnemy':
      classes += ' enemyTile'
      img.push(<img key='bossEnemy' className="gameSprite enemyImage" src={bossEnemyImage} alt='bossEnemy'/>)
      break
    case 'exitDoor':
      classes += ' exitDoor'
      img.push(<img key='door' className="gameSprite doorImage" src={doorImage} alt='door'/>)
      break
    default:
      break
    }
    if (this.props.darkness && this.props.tileData.occupier !== 'hero' && !this.isNearHero(this.props.heroPosition, false)) {
      classes += ' darkness'
    }
    
    return (
      <div
        key={this.props.tileData.id}
        id={'tile'+this.props.tileData.id}
        className={classes}
      >
        {img.map((currentImg) => currentImg)}
      </div>
    )
  }
} // Cell class

export default Tile
