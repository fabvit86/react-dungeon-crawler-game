import React, { Component } from 'react'
import './App.css'
import Board from './Board'
import Hero from './Hero'
import $ from 'jquery'

class App extends Component {
  constructor () {
    super()
    this.state = {
      gameId: 1,
      initialHeroPosition: {x: 0, y: 0}
    }
    // default board values:
    this.rows = 20//60
    this.columns = 20//70
    this.minRooms = 15
    this.maxRooms = 20
    this.minRoomSide = 8
    this.maxRoomSide = 15
    this.repeatUniqueEnemies = 5
    this.numberOfPotions = 8
    this.lineOfSight = 5
    this.darkness = true
    this.items = [
      {itemType: 'armor', itemName: 'chest armor', resistance: 5}, 
      {itemType: 'armor', itemName: 'leg armor', resistance: 3},
      {itemType: 'armor', itemName: 'helm', resistance: 2}, 
      {itemType: 'armor', itemName: 'gloves', resistance: 1},
      {itemType: 'weapon', itemName: 'sword', attack: 10}
    ]
    let potionsIndex = 0
    while (potionsIndex < this.numberOfPotions) {
      this.items.push(
        {itemType: 'potion', itemName: 'potion', health: 10})
      potionsIndex++
    }
    this.enemies = []
    let enemiesIndex = 0
    while (enemiesIndex < this.repeatUniqueEnemies) {
      this.enemies.push(
        {enemyType: 'smallEnemy', health: 15, attack: 20, givenXP: 10, level: 1},
        {enemyType: 'medEnemy', health: 25, attack: 35, givenXP: 15, level: 1},
        {enemyType: 'largeEnemy', health: 40, attack: 50, givenXP: 20, level: 1})
      enemiesIndex++
    }
    this.finalBoss = [{enemyType: 'bossEnemy', health: 150, attack: 70, givenXP: 50, level: 1}]
    this.finalDungeon = false
  }

  notifyParent (heroPosition) {
    this.setState({ initialHeroPosition: heroPosition })
  }

  createFinalDungeon () {
    this.finalDungeon = true
    this.enemies = this.finalBoss
    this.setState({ gameId: this.state.gameId + 1 })
  }

  render() {
    console.log('rendering app...','heroPosition:',this.state.initialHeroPosition)
    return (
      <div className="App">
        <h1>React Dungeon Crawler Game</h1>
        <Board
          key={this.state.gameId}
          rows={this.rows}
          columns={this.columns}
          minRooms={this.minRooms}
          maxRooms={this.maxRooms}
          minRoomSide={this.minRoomSide}
          maxRoomSide={this.maxRoomSide}
          items={this.items}
          enemies={this.enemies}
          createFinalDungeon={this.createFinalDungeon.bind(this)}
          finalDungeon={this.finalDungeon}
          notifyParent={this.notifyParent.bind(this)}
          lineOfSight={this.lineOfSight}
          darkness={this.darkness}
        />
        { //<Hero
        //   position={this.state.initialHeroPosition}
        //   rows={this.rows}
        //   columns={this.columns}
        //   items={this.items}
        //   enemies={this.enemies}
        //   goToFinalDungeon={this.createFinalDungeon.bind(this)}
        //   lineOfSight={this.lineOfSight}
        //   darkness={this.darkness}
        //   toggleDarkness={this.toggleDarkness.bind(this)}
        // />
        }
      </div>
    )
  }
}

export default App
