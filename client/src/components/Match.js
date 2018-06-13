import React from 'react';
import PartTop from './PartTop';
import PartBot from './PartBot';
import '../assets/stylesheets/match.css';

const Match = (props) =>
<div className='Match'>
  <PartTop
    setRoundRange={props.setRoundRange}
    activePlayer={props.activePlayer}
    setActivePlayer={props.setActivePlayer}
    scores={props.scores}
    info={props.info}
    players={props.players}
    rounds={props.rounds} />
  <PartBot
    activePlayer={props.player}
    playerrounds={props.playerrounds} />
</div>

export default Match;
