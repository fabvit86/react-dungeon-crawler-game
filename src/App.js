import React, { Component } from 'react'
import './App.css'
import Board from './Board'

class App extends Component {
  constructor () {
    super()
    this.state = {
      gameId: 1
    }
    // default board values:
    // this.rows = 100
    // this.columns = 100
    this.rows = 50 // test
    this.columns = 50 // test
    this.minRooms = 15
    this.maxRooms = 20
    this.minRoomSide = 8
    this.maxRoomSide = 15
  }

  // change the gameId to render a new game:
  newGame () {
    this.setState({ gameId: this.state.gameId + 1 })
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
        />
      </div>
    )
  }
}

export default App
