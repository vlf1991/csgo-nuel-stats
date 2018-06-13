import React from 'react';
import Scoreboard from '../containers/ScoreboardContainer';
import RoundSlider from '../containers/RoundSliderContainer';
import MatchInfo from '../containers/MatchInfoContainer';

const PartTop = (props) =>
<div className='PartTop'>
  <div className='PTBG' style={{
    background: 'url('+require('../assets/images/maps/'+props.info.map+'.jpg')+')'
  }}></div>
  <div className='PTContent'>
    <MatchInfo
      organiser={props.info.organiser}
      tournament={props.info.tournament}
      date={props.info.date}
      duration={props.info.duration}
      map={props.info.map}
      demo={props.info.demo} />
    <Scoreboard
      activePlayer={props.activePlayer}
      setActivePlayer={props.setActivePlayer}
      players={props.players}
      scores={props.scores}
      teamnames={{team1: props.info.team1, team2: props.info.team2}} />
    <RoundSlider
      setRoundRange={props.setRoundRange}
      rounds={props.rounds} />
  </div>
</div>

export default PartTop;
