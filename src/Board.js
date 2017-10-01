import React, { Component } from 'react'
import Tile from './Tile'
import _ from 'lodash'
import $ from 'jquery'
window.jQuery = $
window.$ = $

class Board extends Component {
  constructor (props) {
    super(props)
    this.rooms = []
    this.numberOfRooms = 0
    this.board = this.createBoard(this.props.rows, this.props.columns)
    this.flattedBoard = _.flatten(this.board)
  }

  // create the game board with the given number of rooms:
  createBoard (n, m) {
    this.numberOfRooms = this.getRandomNumb(this.props.minRooms, this.props.maxRooms)
    // this.numberOfRooms = 10 // TEST
    // create the base board:
    let board = []
    ;for (let r = 0; r < n; r++) {
      let row = []
      ;for (let c = 0; c < m; c++) {
        row.push({
          id: `${r}${c}`,
          rowIndex: r,
          colIndex: c,
          status: 'empty',
          room: 0
        })
      }
      board.push(row)
    }
    this.createRoom(board)
    return board
  }

  // returns a number beetwen a min and a max:
  getRandomNumb (min, max) {
    return Math.floor(Math.random() * (max - min) + min)
  }

  createRoom (board) {
    // generate random room sides:
    const minRoomSide = this.props.minRoomSide
    const maxRoomSide = this.props.maxRoomSide
    const horizontalSide = this.getRandomNumb(minRoomSide, maxRoomSide) // horizontal length
    const verticalSide = this.getRandomNumb(minRoomSide, maxRoomSide) // vertical length
    // find the random starting coordinate to place the first room:
    const x = this.getRandomNumb(0, this.props.columns - horizontalSide)
    const y = this.getRandomNumb(0, this.props.rows - verticalSide)
    // const horizontalSide = 8, verticalSide = 8 // TEST
    // const x = 10, y = 0 //TEST
    // place the first room:
    ;for (let i = x; i < x + verticalSide; i++) {
      for (let j = y; j < y + horizontalSide; j++) {
        board[i][j].status = 'roomTile' // indicates that this tile belongs to a room
        board[i][j].room = 1 // indicates that this tile belongs to the first room
      }
    }
    // add the first room to the rooms array:
    this.rooms.push({
      roomId: 1,
      topX: x,
      bottomX: x + verticalSide - 1,
      leftY: y,
      rightY: y + horizontalSide - 1,
      horizontalSize: horizontalSide,
      verticalSize: verticalSide
    })
    this.placeNextRoom(board, 1, 1)
    console.log(this.rooms)
  }

  // assign the tiles to a room if possible:
  assignRoomTiles (board, x, y, verticalSide, horizontalSide, roomIndex) {
    console.log('placing room number',roomIndex,'from:',x,y,'size=',horizontalSide,'x',verticalSide) //TEST
    let assignedTiles = []
    for (let i = x; i < x + verticalSide; i++) {
      for (let j = y; j < y + horizontalSide; j++) {
        // check if the tile is not already assigned to a room:
        if (board[i][j].status !== 'empty'){
          // unset previously assigned tiles:
          assignedTiles.forEach((element) => board[element.rowIndex][element.columnIndex].status = 'empty')
          return false
        }
        board[i][j].status = 'roomTile' // indicates that this tile belongs to a room
        board[i][j].room = roomIndex // indicates that this tile belongs to this room
        assignedTiles.push({rowIndex: i, columnIndex: j})
      }
    }
    // add the room:
    this.rooms.push({
      roomId: roomIndex,
      topX: x,
      bottomX: x + verticalSide - 1,
      leftY: y,
      rightY: y + horizontalSide - 1,
      horizontalSize: horizontalSide,
      verticalSize: verticalSide
    })
    return true // all tiles assigned successfully
  }

  placeNextRoom(board, placedRooms, neighborRoomStep) {
    console.log('placedRooms:',placedRooms, 'neighborRoomStep=',neighborRoomStep) // TEST
    if (placedRooms === this.numberOfRooms) return
    // size of the new room:
    const horizontalSide = this.getRandomNumb(this.props.minRoomSide, this.props.maxRoomSide)
    const verticalSide = this.getRandomNumb(this.props.minRoomSide, this.props.maxRoomSide)
    
    let x, y // starting coordinates of the new room
    const neighborRoomIndex = this.rooms.length - neighborRoomStep

    // if there is no space left on the board, stop execution:
    if (neighborRoomIndex < 0) { // this is true if every room has been examined
      console.log('neighborRoomIndex', neighborRoomIndex, 'board full') //TEST
      return 
    }
    const neighborRoom = this.rooms[neighborRoomIndex]
    let roomAssigned = false

    // borders check:
    // check if there is enough space on the top:
    if (!roomAssigned && neighborRoom.topX - 1 - verticalSide >= 0) {
      let yOffset = Math.abs(Math.ceil((neighborRoom.horizontalSize - horizontalSide) / 2)) // used to center it horizontally on top of the other
      x = neighborRoom.topX - 1 - verticalSide
      y = neighborRoom.leftY + yOffset
      //if current room is horizontally bigger than neighbor room, check if exceeds left or right border:
      if (horizontalSide > neighborRoom.horizontalSize) {
        const extraTiles = horizontalSide - neighborRoom.horizontalSize
        // check left border overflow:
        neighborRoom.leftY - extraTiles < 0 ? y = neighborRoom.leftY : y = neighborRoom.leftY - extraTiles
      }
      // place the room on top of the neighbor room, skipping one tile row for the corridor:
      roomAssigned = this.assignRoomTiles (board, x, y, verticalSide, horizontalSide, placedRooms + 1)
      // room created successfully:
      if (roomAssigned) { 
        placedRooms++
      } else {
        console.log('top space already occupied') //placeholder
      }
    } 
    // check if there is enough space on the bottom:
    if (!roomAssigned && neighborRoom.bottomX + 1 + verticalSide < this.props.rows) {
      let yOffset = Math.abs(Math.ceil((neighborRoom.horizontalSize - horizontalSide) / 2))
      x = neighborRoom.bottomX + 2
      y = neighborRoom.leftY + yOffset
      //if current room is horizontally bigger than neighbor room, there must be space horizontally too:
      if (horizontalSide > neighborRoom.horizontalSize) {
        const extraTiles = horizontalSide - neighborRoom.horizontalSize
        // check left border overflow:
        neighborRoom.leftY - extraTiles < 0 ? y = neighborRoom.leftY : y = neighborRoom.leftY - extraTiles
      }
      // place the room under the neighbor room, leaving skipping one tile row for the corridor:
      roomAssigned = this.assignRoomTiles (board, x, y, verticalSide, horizontalSide, placedRooms + 1)
      // room created successfully:
      if (roomAssigned) { 
        placedRooms++
      } else {
        console.log('bottom space already occupied') //placeholder
      }
    } 
    // check if there is enough space on the left:
    if (!roomAssigned && neighborRoom.leftY - 1 - horizontalSide >= 0) {
      let xOffset = Math.abs(Math.ceil((neighborRoom.verticalSize - verticalSide) / 2))
      x = neighborRoom.topX + xOffset
      y = neighborRoom.leftY - 1 - horizontalSide
      //if current room is vertically bigger than neighbor room, there must be space vertically too:
      if (verticalSide > neighborRoom.verticalSize) {
        const extraTiles = verticalSide - neighborRoom.verticalSize
        // check top border overflow:
        neighborRoom.topX - extraTiles < 0 ? x = neighborRoom.topX : x = neighborRoom.topX - extraTiles
      }
      // place the room left to the neighbor room, leaving skipping one tile row for the corridor:
      roomAssigned = this.assignRoomTiles (board, x, y, verticalSide, horizontalSide, placedRooms + 1)
      // room created successfully:
      if (roomAssigned) { 
        placedRooms++
      } else {
        console.log('left space already occupied') //placeholder
      }
    }
    // check if there is enough space on the right:
    if (!roomAssigned && neighborRoom.rightY + 1 + horizontalSide < this.props.columns) {
      let xOffset = Math.abs(Math.ceil((neighborRoom.verticalSize - verticalSide) / 2))
      x = neighborRoom.topX + xOffset
      y = neighborRoom.rightY + 2
      //if current room is vertically bigger than neighbor room, there must be space vertically too:
      if (verticalSide > neighborRoom.verticalSize) {
        const extraTiles = verticalSide - neighborRoom.verticalSize
        // check top border overflow:
        neighborRoom.topX - extraTiles < 0 ? x = neighborRoom.topX : x = neighborRoom.topX - extraTiles
      }
      // place the room left to the neighbor room, leaving skipping one tile row for the corridor:
      roomAssigned = this.assignRoomTiles (board, x, y, verticalSide, horizontalSide, placedRooms + 1)
      // room created successfully:
      if (roomAssigned) { 
        placedRooms++
      } else {
        console.log('right space already occupied') //placeholder
      }
    } 
    // no space around this room, try another room:
    if (!roomAssigned) {
      console.log('no space around this room, try another room')
      neighborRoomStep++
    } else {
      neighborRoomStep = 1
    }

    // recursive call:
    this.placeNextRoom(board, placedRooms, neighborRoomStep)
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
} // Board class

export default Board
