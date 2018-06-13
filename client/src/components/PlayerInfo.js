import React from 'react';

/*
activePlayer: {
  name: null,
  steamid: null,
  team: 0,
  kills: 0,
  assists: 0,
  deaths: 0,
  headshots: 0,
  clutchkills: 0,
  firstkills: 0,
  awpkills: 0,
  damage: 0,
  roundsplayed: 0,
  flashenemytime: 0,
  bombsplanted: 0,
  bombsdefused: 0,
  adr: 0,
}
*/

const PlayerInfo = (props) =>
<div className='PlayerInfo'>
  <div className='PIKills' title='Kills'>
    <div className='PILabel'>K</div>
    <div className='PIContent'>
      {props.kills}
    </div>
  </div>
  <div className='PIAssists' title='Assists'>
    <div className='PILabel'>A</div>
    <div className='PIContent'>
      {props.assists}
    </div>
  </div>
  <div className='PIDeaths' title='Deaths'>
    <div className='PILabel'>D</div>
    <div className='PIContent'>
      {props.deaths}
    </div>
  </div>
  <div className='PIHeadshots' title='Headshots'>
    <div className='PILabel'>HS</div>
    <div className='PIContent'>
      {props.headshots}
    </div>
  </div>
  <div className='PIAdr' title='Avg. Damage/Round'>
    <div className='PILabel'>ADR</div>
    <div className='PIContent'>
      {props.adr.toFixed(1)}
    </div>
  </div>
  <div className='PIFirstkills' title='First Kills'>
    <div className='PILabel'>FK</div>
    <div className='PIContent'>
      {props.firstkills}
    </div>
  </div>
  <div className='PIClutchkills' title='Clutch Kills'>
    <div className='PILabel'>CK</div>
    <div className='PIContent'>
      {props.clutchkills}
    </div>
  </div>
  <div className='PIAwpkills' title='AWP Kills'>
    <div className='PILabel'>AWP</div>
    <div className='PIContent'>
      {props.awpkills}
    </div>
  </div>
  <div className='PIFlashenemytime' title='Flash Enemy Duration'>
    <div className='PILabel'>FED</div>
    <div className='PIContent'>
      {props.flashenemytime.toFixed(1)}
    </div>
  </div>
  <div className='PIBombsplanted' title='Bombs Planted'>
    <div className='PILabel'>BP</div>
    <div className='PIContent'>
      {props.bombsplanted}
    </div>
  </div>
  <div className='PIBombsdefused' title='Bombs Defused'>
    <div className='PILabel'>BD</div>
    <div className='PIContent'>
      {props.bombsdefused}
    </div>
  </div>
</div>

export default PlayerInfo;
