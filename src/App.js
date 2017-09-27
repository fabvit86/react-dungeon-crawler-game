import React, { Component } from 'react'
import './App.css'
import Board from './Board'

class App extends Component {
  constructor () {
    super()
    this.state = {
      gameId: 1
    }
    // default board size:
    this.rows = 100
    this.columns = 150
    this.rooms = 15
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
          rooms={this.rooms}
        />
      </div>
    )
  }
}

export default App
