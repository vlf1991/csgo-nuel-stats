import React from 'react';
import Players from '../containers/PlayersContainer';

const Scoreboard = (props) =>
<div className='Scoreboard'>
  <div className='Teamnames'>
    <div className='TeamnameCT'>
      {props.teamnames.team2}
    </div>
    <div className='TeamnameT'>
      {props.teamnames.team1}
    </div>
  </div>
  <div className='Teamscores'>
    <div className='TeamscoreCT'>
      <div className='Teamscoreimg'>
        <img src={require('../assets/images/icons/icon_ct.png')} alt='CT Icon' />
      </div>
      <div className='Teamscore'>
        {props.scores.team2}
      </div>
    </div>
    <div className='TeamscoreT'>
      <div className='Teamscore'>
        {props.scores.team1}
      </div>
      <div className='Teamscoreimg'>
        <img src={require('../assets/images/icons/icon_t.png')} alt='T Icon' />
      </div>
    </div>
  </div>
  <Players {...props} />
</div>

export default Scoreboard;
