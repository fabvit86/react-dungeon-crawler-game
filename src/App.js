import React, { Component } from 'react'
import './App.css'
import Board from './Board'

class App extends Component {
  constructor () {
    super()
    this.state = {
      gameId: 1,
      initialHeroPosition: {x: 0, y: 0},
      heroStats: this.startingHeroStats(),
      heroItems: []
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
        {itemType: 'potion', itemName: 'potion', health: 30})
      potionsIndex++
    }
    this.enemies = this.createEnemies()
    this.finalBoss = [{enemyType: 'bossEnemy', health: 150, attack: 60, givenXP: 50, level: 1}]
    this.finalDungeon = false
  }

  createEnemies () {
    if (this.finalDungeon) {
      return this.finalBoss
    } else {
      let enemiesIndex = 0
      let enemiesArray = []
      while (enemiesIndex < this.repeatUniqueEnemies) {
        enemiesArray.push(
          {enemyType: 'smallEnemy', health: 15, attack: 20, givenXP: 10, level: 1},
          {enemyType: 'medEnemy', health: 25, attack: 35, givenXP: 15, level: 1},
          {enemyType: 'largeEnemy', health: 40, attack: 50, givenXP: 20, level: 1})
        enemiesIndex++
      }
      return enemiesArray
    }
  }

  startingHeroStats () {
    return {
      health: 100,
      maxHealth: 100,
      attack: 10, // increses with weapon item
      level: 1,
      exp: 0,
      nextLvlExp: 15,
      weapon: 'bare fists',
      resistance: 0 // increses with armor items
    }
  }

  notifyParent (heroPosition) {
    this.setState({ initialHeroPosition: heroPosition })
  }

  // create the final dungeon, keeping the hero's stats and items:
  createFinalDungeon (heroStats, heroItems) {
    this.finalDungeon = true
    this.enemies = this.createEnemies()
    this.setState({ 
      gameId: this.state.gameId + 1,
      heroStats: heroStats,
      heroItems: heroItems
    })
  }

  // start a new game:
  startNewGame () {
    this.darkness = true
    this.finalDungeon = false
    this.enemies = this.createEnemies()
    this.setState({ 
      gameId: this.state.gameId + 1,
      initialHeroPosition: {x: 0, y: 0},
      heroStats: this.startingHeroStats(),
      heroItems: []
    })
  }

  render() {
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
          heroStats={this.state.heroStats}
          heroItems={this.state.heroItems}
          startNewGame={this.startNewGame.bind(this)}
        />
      </div>
    )
  }
}

export default App
