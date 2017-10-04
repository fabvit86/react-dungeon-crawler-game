// dumb component that shows hero's stats
import React from 'react'

const StatusBar = ({stats}) => {
  return (
    <div id='statusBar'>
      <table id='statsTable'><tbody>
        <tr>
          <td className='level'>Level:<br></br><span className='level'>{stats.level}</span></td>
          <td className='untilNextLvl'>until next lvl:<br></br><span className='untilNextLvl'>{stats.nextLvlExp - stats.exp} EXP</span></td>
          <td className='health'>Health:<br></br><span className='health'>{`${stats.health}/${stats.maxHealth}`}</span></td>
          <td className='attack'>Attack:<br></br><span className='attack'>{stats.attack}</span></td>
          <td className='weapon'>Weapon:<br></br><span className='weapon'>{stats.weapon}</span></td>
          <td className='resistance'>Resistance:<br></br><span className='resistance'>{stats.resistance}</span></td>
        </tr>
      </tbody></table>
    </div>
  )
} // StatusBar component

export default StatusBar
