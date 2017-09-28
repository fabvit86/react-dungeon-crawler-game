import React, { Component } from 'react'
import Tile from './Tile'
import _ from 'lodash'
import $ from 'jquery'
window.jQuery = $
window.$ = $

class Board extends Component {
  constructor (props) {
    super(props)
    this.board = this.createBoard(this.props.rows, this.props.columns)
    this.flattedBoard = _.flatten(this.board)
  }

  // create the game board with the given number of rooms:
  createBoard(n, m) {
    // create the base board:
    let board = []
    ;for (let r = 0; r < n; r++) {
      let row = []
      ;for (let c = 0; c < m; c++) {
        row.push({
          id: `${r}${c}`,
          rowIndex: r,
          colIndex: c,
          status: 'empty'
        })
      }
      board.push(row)
    }
    this.createRoom(board)
    return board
  }

  createRoom(board) {
    // generate random room sides:
    const getRandomNumb = (min, max) => Math.floor(Math.random() * (max - min) + min)
    const minRoomSide = this.props.minRoomSide
    const maxRoomSide = this.props.maxRoomSide
    const verticalSide = getRandomNumb(minRoomSide, maxRoomSide)
    const horizontalSide = getRandomNumb(minRoomSide, maxRoomSide)
    // find the random starting coordinate to place the first room:
    const x = getRandomNumb(0, this.props.columns - horizontalSide)
    const y = getRandomNumb(0, this.props.rows - verticalSide)
    // place the first room:
    ;for (let i = x; i < x + horizontalSide - 1; i++) {
      for (let j = y; j < y + verticalSide - 1; j++) {
        board[i][j].status = 'roomTile'
      }
    }
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
          currentRow.map((currentTile) => {
            return (
              <Tile 
                key={currentTile.id}
                tileData={currentTile}
              />
            )
          })
        )}
      </div> 
    )
  }
}

export default Board
