import React from 'react';

function selectIcon(type, teamwon, round) {
  var colour = teamwon;
  if(round > 15) {
    if(teamwon === 1) {
      colour = 2;
    } else {
      colour = 1;
    }
  }
  switch(type) {
    case 'bomb':
      return (
        <img style={{width: '100%'}} src={require('../assets/images/icons/bomb'+colour+'.png')} alt={type} />
      );
    case 'defuse':
      return (
        <img style={{width: '100%'}} src={require('../assets/images/icons/defuse'+colour+'.png')} alt={type} />
      );
    case 'elim':
      return (
        <img style={{width: '100%'}} src={require('../assets/images/icons/elim'+colour+'.png')} alt={type} />
      );
    case 'time':
      return (
        <img style={{width: '100%'}} src={require('../assets/images/icons/time'+colour+'.png')} alt={type} />
      );
    default:
      return null;
  }
}

const RoundEndIcon = (props) =>
<div className='RoundEndIcon'>
  {
    selectIcon(props.type, props.teamwon, props.round)
  }
</div>

export default RoundEndIcon;
