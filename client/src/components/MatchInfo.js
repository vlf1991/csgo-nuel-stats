import React from 'react';

function getDate(timestamp) {
  var date = new Date(timestamp);
  var year = date.getFullYear();
  var month = date.getMonth() < 10 ? '0'+date.getMonth() : date.getMonth();
  var day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  return day+'/'+month+'/'+year+', '+hours+':'+minutes;
}

const MatchInfo = (props) =>
<div className='MatchInfo'>
  <div className='MIItem MIOrganiser'>
    <div className='MIContent'>   
      <img src={require('../assets/images/organisers/'+props.organiser+'.png')} alt={props.organiser} />
    </div>
  </div>
  <div className='MIItem MITournament'>
    <div className='MILabel'>Tournament</div>
    <div className='MIContent'>
      {props.tournament}
    </div>
  </div>
  <div className='MIItem MIDate'>
    <div className='MILabel'>Date</div>
    <div className='MIContent'>
      {getDate(props.date)}
    </div>
  </div>
  <div className='MIItem MIDuration'>
    <div className='MILabel'>Duration</div>
    <div className='MIContent'>
      {props.duration+' Minutes'}
    </div>
  </div>
  <div className='MIItem MIMap'>
    <div className='MILabel'>Map</div>
    <div className='MIContent'>
      {props.map}
    </div>
  </div>
  <div className='MIItem MIDemo'>
    <div className='MILabel'>Demo</div>
    <div className='MIContent'>
      <a href={props.demo}>
        <img src={require('../assets/images/icons/download.png')} alt='Download' />
      </a>
    </div>
  </div>
</div>

export default MatchInfo;
