import React from 'react';
import Rounds from '../containers/RoundsContainer';
import PlayerInfo from '../containers/PlayerInfoContainer';

const PartBot = (props) =>
<div className='PartBot'>
  <PlayerInfo
    {...props.activePlayer} />
  <Rounds
    activePlayer={
      {
        steamid: props.activePlayer.steamid,
        name: props.activePlayer.name
      }
    }
    playerrounds={ props.playerrounds[props.activePlayer.steamid] } />
</div>

export default PartBot;
