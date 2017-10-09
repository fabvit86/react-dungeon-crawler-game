// dumb component that shows hero's stats
import React from 'react'
import { Badge, Button } from 'reactstrap'

const StatusBar = ({stats}) => {
  return (
    <div id='statusBar'>
      <table id='statsTable'><tbody>
        <tr>
          <td className='level'>
            <Button color="primary" outline>
              Level <Badge id='levelBadge' color="primary">{stats.level}</Badge>
            </Button>
          </td>
          <td className='untilNextLvl'>
            <Button color="primary" outline>
              Until Next Lvl <Badge id='untilNextLvlBadge' color="primary">{stats.nextLvlExp - stats.exp} EXP</Badge>
            </Button>
          </td>
          <td className='health'>
            <Button color="danger" outline>
              Health <Badge id='healthBadge' color="danger">{`${stats.health}/${stats.maxHealth}`}</Badge>
            </Button>
          </td>
          <td className='weapon'>
            <Button color="success" outline>
              Weapon <Badge id='weaponBadge' color="success">{stats.weapon}</Badge>
            </Button>
          </td>
          <td className='attack'>
            <Button color="dark" outline>
              Attack <Badge id='attackBadge' color="dark">{stats.attack}</Badge>
            </Button>
          </td>
          <td className='resistance'>
            <Button color="info" outline>
              Resistance <Badge id='resistanceBadge' color="info">{stats.resistance}</Badge>
            </Button>
          </td>
        </tr>
      </tbody></table>
    </div>
  )
} // StatusBar component

export default StatusBar
