import React, { Component } from 'react'
import './App.css'
import Board from './Board'
import Hero from './Hero'

class App extends Component {
  constructor () {
    super()
    this.state = {
      gameId: 1,
      initialHeroPosition: {x: 0, y: 0}
    }
    // default board values:
    this.rows = 30
    this.columns = 30
    this.minRooms = 15
    this.maxRooms = 20
    this.minRoomSide = 8
    this.maxRoomSide = 15
    this.items = [
      {itemType: 'armor', itemName: 'chest armor', resistance: 5}, 
      {itemType: 'armor', itemName: 'leg armor', resistance: 3},
      {itemType: 'armor', itemName: 'helm', resistance: 2}, 
      {itemType: 'armor', itemName: 'gloves', resistance: 1},
      {itemType: 'weapon', itemName: 'sword', attack: 10},
      {itemType: 'potion', itemName: 'potion', health: 8},
      {itemType: 'potion', itemName: 'potion', health: 8},
      {itemType: 'potion', itemName: 'potion', health: 8}
    ]
    this.enemies = [
      {enemyType: 'smallEnemy', health: 15, attack: 20, givenXP: 10, level: 1},
      {enemyType: 'medEnemy', health: 25, attack: 35, givenXP: 15, level: 1},
      {enemyType: 'largeEnemy', health: 40, attack: 50, givenXP: 20, level: 1}
    ]
    this.finalDungeon = false
  }

  notifyParent (heroPosition) {
    this.setState({ initialHeroPosition: heroPosition })
  }

  newGame () {
    this.finalDungeon = true
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
          newGame={this.newGame.bind(this)}
          finalDungeon={this.finalDungeon}
          notifyParent={this.notifyParent.bind(this)}
        />
        <Hero 
          position={this.state.initialHeroPosition}
          rows={this.rows}
          columns={this.columns}
          items={this.items}
          enemies={this.enemies}
          nextDungeon={this.newGame.bind(this)}
        />
      </div>
    )
  }
}

export default App
