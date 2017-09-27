import React, { Component } from 'react'
import Tile from './Tile'
import $ from 'jquery'
window.jQuery = $
window.$ = $

class Board extends Component {
  constructor (props) {
    super(props)
    this.board = this.createBoard(this.props.rows, this.props.columns, this.props.rooms)
  }

  // create the game board with the given number of rooms:
  createBoard(n, m, rooms) {
    let board = []
    ;for (let r = 0; r < n; r++) {
      let row = []
      ;for (let c = 0; c < m; c++) {
        row.push({
          id: `${r}${c}`,
          rowIndex: r,
          colIndex: c,
        })
      }
      board.push(row)
    }
    return board
  }

  componentDidMount () {
    // set the size of the board:
    const tileSize = 10 // pixels
    const boardWidth = this.props.columns * (tileSize + 2)
    const boardHeight = this.props.rows * (tileSize + 2)
    $('#board').css('width', boardWidth)
    $('#board').css('height', boardHeight)
  }

  render () {
    return (
      <div id='board'>
        {this.board.map((currentRow) =>
          currentRow.map((currentCell) => {
            return (
              <Tile 
                key={currentCell.id}
                tileData={currentCell}
              />
            )
          })
        )}
      </div> 
    )
  }
}

export default Board
