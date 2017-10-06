import React, { Component } from 'react'
import Tile from './Tile'
import Hero from './Hero'
import _ from 'lodash'
import $ from 'jquery'

class Board extends Component {
  constructor (props) {
    super(props)
    this.rooms = []
    this.numberOfRooms = 0
    this.board = this.createBoard(this.props.rows, this.props.columns)
    this.initialHeroPosition = this.placeHeroAndItems('hero')
    // items position:
    this.items = this.props.items
    this.items.forEach((element, index) => {
      let itemClass
      element.itemType === 'potion' ? itemClass = 'potion' : itemClass = 'item'
      this.items[index].position = this.placeHeroAndItems(itemClass)
    })
    // enemies position:
    this.enemies = this.props.enemies
    this.enemies.forEach((element, index) => {
      this.enemies[index].position = this.placeHeroAndItems(this.enemies[index].enemyType)
    })
    this.state = {
      dungeonLevel: 1
    }
  }

  // create the game board with the given number of rooms:
  createBoard (n, m) {
    this.numberOfRooms = this.getRandomNumb(this.props.minRooms, this.props.maxRooms)
    // create the base board:
    let board = []
    ;for (let r = 0; r < n; r++) {
      let row = []
      ;for (let c = 0; c < m; c++) {
        row.push({
          id: `${r}-${c}`,
          rowIndex: r,
          colIndex: c,
          status: 'empty',
          occupier: 'none',
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
    const x = this.getRandomNumb(0, this.props.rows - verticalSide)
    const y = this.getRandomNumb(0, this.props.columns - horizontalSide)
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
    this.createRooms(board, 1, 1)
  }

  // assign the tiles to a room if possible:
  assignRoomTiles (board, x, y, verticalSide, horizontalSide, roomIndex, xCorridor, yCorridor) {
    let assignedTiles = []
    for (let i = x; i < x + verticalSide; i++) {
      for (let j = y; j < y + horizontalSide; j++) {
        // check if the tile is not already assigned to a room:
        if (board[i][j].status !== 'empty'){
          // unset previously assigned tiles:
          assignedTiles.forEach((element) => {
            board[element.rowIndex][element.columnIndex].status = 'empty'
            board[element.rowIndex][element.columnIndex].room = 0
          })
          return false
        }
        board[i][j].status = 'roomTile' // indicates that this tile belongs to a room
        board[i][j].room = roomIndex // indicates that this tile belongs to this room
        assignedTiles.push({rowIndex: i, columnIndex: j})
      }
    }
    // create corridor between rooms:
    board[xCorridor][yCorridor].status = 'roomTile corridor'
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

  placeRoom (board, neighborRoom, horizontalSide, verticalSide, placedRooms, position) {
    let x, y, offset // starting coordinates of the new room
    let xCorridor, yCorridor // coordinates of the corridor
    switch (position) {
    case 'top': 
    case 'bottom':
      if (position === 'top') {
        x = neighborRoom.topX - 1 - verticalSide
        xCorridor = neighborRoom.topX - 1
      } else {
        x = neighborRoom.bottomX + 2
        xCorridor = neighborRoom.bottomX + 1
      }
      offset = Math.abs(Math.ceil((neighborRoom.horizontalSize - horizontalSide) / 2)) // used to center it horizontally on top of the other
      y = neighborRoom.leftY + offset
      //if current room is horizontally bigger than neighbor room, check if exceeds left or right border:
      if (horizontalSide > neighborRoom.horizontalSize) {
        const extraTiles = horizontalSide - neighborRoom.horizontalSize
        neighborRoom.leftY - extraTiles < 0 ? y = neighborRoom.leftY : y = neighborRoom.leftY - extraTiles
      }
      yCorridor = y + Math.floor(horizontalSide / 2)
      break
    case 'left':
    case 'right':
      if (position === 'left') {
        y = neighborRoom.leftY - 1 - horizontalSide
        yCorridor = neighborRoom.leftY - 1
      } else {
        y = neighborRoom.rightY + 2
        yCorridor = neighborRoom.rightY + 1
      }
      offset = Math.abs(Math.ceil((neighborRoom.verticalSize - verticalSide) / 2))
      x = neighborRoom.topX + offset
      //if current room is vertically bigger than neighbor room, check if exceeds top or bottom border:
      if (verticalSide > neighborRoom.verticalSize) {
        const extraTiles = verticalSide - neighborRoom.verticalSize
        neighborRoom.topX - extraTiles < 0 ? x = neighborRoom.topX : x = neighborRoom.topX - extraTiles
      }
      xCorridor = x + Math.floor(verticalSide / 2)
      break
    default: 
      return false
    }
    return this.assignRoomTiles (board, x, y, verticalSide, horizontalSide, placedRooms + 1, xCorridor, yCorridor)
  }

  // create all the dungeon's rooms recursively
  createRooms(board, placedRooms, neighborRoomStep) {
    if (placedRooms === this.numberOfRooms) return
    // size of the new room:
    const horizontalSide = this.getRandomNumb(this.props.minRoomSide, this.props.maxRoomSide)
    const verticalSide = this.getRandomNumb(this.props.minRoomSide, this.props.maxRoomSide)
    
    const neighborRoomIndex = this.rooms.length - neighborRoomStep

    // if there is no space left on the board, stop trying to add more rooms:
    if (neighborRoomIndex < 0) { // this is true if every room has been examined
      this.numberOfRooms = placedRooms
      return 
    }
    const neighborRoom = this.rooms[neighborRoomIndex]
    let roomAssigned = false

    // borders overflow check:
    // check if there is enough space on the top:
    if (!roomAssigned && neighborRoom.topX - 1 - verticalSide >= 0) {
      roomAssigned = this.placeRoom(board, neighborRoom, horizontalSide, verticalSide, placedRooms, 'top')
    }
    // check if there is enough space on the bottom:
    if (!roomAssigned && neighborRoom.bottomX + 1 + verticalSide < this.props.rows) {
      roomAssigned = this.placeRoom(board, neighborRoom, horizontalSide, verticalSide, placedRooms, 'bottom')
    } 
    // check if there is enough space on the left:
    if (!roomAssigned && neighborRoom.leftY - 1 - horizontalSide >= 0) {
      roomAssigned = this.placeRoom(board, neighborRoom, horizontalSide, verticalSide, placedRooms, 'left')
    }
    // check if there is enough space on the right:
    if (!roomAssigned && neighborRoom.rightY + 1 + horizontalSide < this.props.columns) {
      roomAssigned = this.placeRoom(board, neighborRoom, horizontalSide, verticalSide, placedRooms, 'right')
    }
    
    if (roomAssigned) { 
      // room created successfully:
      placedRooms++
      neighborRoomStep = 1
    } else {
      // there was no space around this room, try another room incrementing neighborRoomStep:
      neighborRoomStep++
    }

    // recursive call:
    this.createRooms(board, placedRooms, neighborRoomStep)
  }

  // randomly place hero and items:
  placeHeroAndItems (type) {
    const flattedBoard = _.flatten(this.board)
    const roomTiles = flattedBoard.filter((element) => element.status === 'roomTile' && element.occupier === 'none')
    const randomRoomTile = roomTiles[Math.floor(Math.random()*roomTiles.length)]
    const x = randomRoomTile.rowIndex
    const y = randomRoomTile.colIndex
    this.board[x][y].occupier = type
    return { x: x, y: y }
  }

  gameOver () {
    // TODO
  }

  componentDidMount () {
    // set the size of the board:
    const tileSize = 20 // pixels
    const boardWidth = this.props.columns * (tileSize)
    const boardHeight = this.props.rows * (tileSize)
    $('#board').css('width', boardWidth)
    $('#board').css('height', boardHeight)
  }

  render () {
    console.log('rendering board...')
    return (
      <div>
        <div id='board'>
          <Hero 
            board={this.board}
            position={this.initialHeroPosition}
            rows={this.props.rows}
            columns={this.props.columns}
            items={this.items}
            enemies={this.enemies}
          />
          {this.board.map((currentRow) =>
            currentRow.map((currentTile) => {
              // check if this tile contains an item and pass it to the Tile component:
              let item
              if (currentTile.occupier === 'item') {
                item = this.items.filter((el) => el.position.x === currentTile.rowIndex && el.position.y === currentTile.colIndex)[0]
              }
              return (
                <Tile 
                  key={currentTile.id}
                  tileData={currentTile}
                  item={item}
                ></Tile>
              )
            })
          )}
        </div>
        <div id='tooltipDiv' className="tooltip bs-tooltip-top" data-placement="top">
          <div className='tooltip-inner'></div>
          <span className='arrow'></span>
        </div>
      </div>
    )
  }
} // Board class

export default Board
