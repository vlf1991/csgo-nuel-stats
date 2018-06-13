import React from 'react';
import Player from '../containers/PlayerContainer';

const Players = (props) =>
<div className='Players'>
  <div className='PlayerLabels'>
    <div className='PlayerLabel'></div>
    <div title='Kills' className='PlayerLabel'>K</div>
    <div title='Assists' className='PlayerLabel'>A</div>
    <div title='Deaths' className='PlayerLabel'>D</div>
    <div title='Headshots' className='PlayerLabel'>HS</div>
    <div title='Average Damage per Round' className='PlayerLabel'>ADR</div>
    <div title='First Kills' className='PlayerLabel'>FK</div>
    <div title='Clutch Kills' className='PlayerLabel'>CK</div>
    <div title='AWP Kills' className='PlayerLabel'>AK</div>
    <div title='Rounds with 3 kills' className='PlayerLabel'>3k</div>
    <div title='Rounds with 4 kills' className='PlayerLabel'>4k</div>
    <div title='Rounds with 5 kills' className='PlayerLabel'>5k</div>
    <div title='Flash Enemy Duration (seconds)' className='PlayerLabel'>FED</div>
    <div title='Bombs Planted' className='PlayerLabel'>BP</div>
    <div title='Bombs Defused' className='PlayerLabel'>BD</div>
  </div>
  <div className='PlayersCT'>
    {
      //Check players exist
      props.players ?
        //Create each round
        props.players.map((player, i) => {
          if(player.team === 2) {
            return (
              <Player
                key={i}
                active={props.activePlayer === player.steamid ? true : false}
                setActivePlayer={props.setActivePlayer}
                player={player}
              />
            );
          } else {
            return null;
          }
        })
      :
        <p>No player data!</p>
    }
  </div>
  {
  }
  <div className='PlayersT'>
    {
      //Check players exist
      props.players ?
        //Create each round
        props.players.map((player, i) => {
          if(player.team === 1) {
            return (
              <Player
                key={i}
                active={props.activePlayer === player.steamid ? true : false}
                setActivePlayer={props.setActivePlayer}
                player={player}
              />
            );
          } else {
            return null;
          }
        })
      :
        <p>No player data!</p>
    }
  </div>
</div>

export default Players;
