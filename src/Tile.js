import React, { Component } from 'react'
import heroImage from './assets/images/game-sprites/human_male.png'
import treasureChestImage from './assets/images/game-sprites/chest.png'
import potionImage from './assets/images/game-sprites/potion.png'
import smallEnemyImage from './assets/images/game-sprites/enemy_small.png'
import medEnemyImage from './assets/images/game-sprites/enemy_med.png'
import largeEnemyImage from './assets/images/game-sprites/enemy_large.png'

class Tile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      occupier: this.props.tileData.occupier
    }
  }

  render () {
    // console.log('rendering tile', this.props.tileData.id) // TEST
    let classes = 'tile ' + this.props.tileData.status + ' room' + this.props.tileData.room
    let img = ''
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
    default:
      break
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
