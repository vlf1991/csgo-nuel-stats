import React from 'react';
import Round from '../containers/RoundContainer';


const Rounds = (props) =>
<div className='PlayerRounds'>
  <div className='RoundsTitle'>
    {
      props.activePlayer.name &&
      props.activePlayer.name+"'s Round Performance"
    }
  </div>
  <div className='Rounds'>
    {
      props.playerrounds ?
        props.playerrounds.map((round, i) => {
          return (
            round.played ?
              <Round
                key={i}
                played={ true }
                teamswap={ i < 15 ? round.teamswap : !round.teamswap }
                won={ round.won }
                died={ round.died }
                plant={ round.plant }
                defuse={ round.defuse }
                kills={ round.kills }
                headshots={ round.headshots }
                assists={ round.assists }
                damage={ round.damage }
                flashenemytime={ round.flashenemytime }
              />
            :
              <Round key={i} played={ false } />
          );
        })
      :
      ''
    }
  </div>
</div>

export default Rounds;
