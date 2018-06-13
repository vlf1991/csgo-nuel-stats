import React from 'react';

const Round = (props) =>
<div className={
  //Team colouring
  props.played ?
    props.teamswap ?
      props.won ?
        'Round ColourT' //T Orange
      :
        'Round ColourT ColourLost' //T Orange
    :
      props.won ?
        'Round ColourCT' //CT Blue
      :
        'Round ColourCT ColourLost' //CT Blue
  :
    'Round'
}>
  <div className='RoundTop'>
    {
      //Headshots
      props.headshots > 0 &&
      [...Array(props.headshots)].map((x, i) => {
        return (
          <div key={i} className='RoundKill'>
            <img src={require('../assets/images/icons/icon_kill_headshot.png')} alt='H' />
          </div>
        )
      })
    }
    {
      //Regular Kills
      props.kills > 0 &&
      [...Array(props.kills - props.headshots)].map((x, i) => {
        return (
          <div key={i} className='RoundKill'>
            <img src={require('../assets/images/icons/icon_kill.png')} alt='K' />
          </div>
        )
      })
    }
  </div>
  <div className='RoundMid'></div>
  <div className='RoundBot'>
    <div className='RoundBotFiller'>
      {
        //Deaths
        props.died &&
        <div className='RoundDeath'>
          <img src={require('../assets/images/icons/icon_death.png')} alt='D' />
        </div>
      }
    </div>
  </div>
</div>

export default Round;
