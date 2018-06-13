import React from 'react';

function steamIDtoURL(steamID) {
  var steamIDp2 = steamID.substr(steamID.lastIndexOf(':')-1, 1);
  var steamIDp3 = steamID.substring(steamID.lastIndexOf(':')+1);
  var steamID32 = parseInt(steamIDp2, 10) + parseInt(steamIDp3, 10)*2;
  return 'https://steamcommunity.com/profiles/[U:1:'+steamID32+']';
}

const Player = (props) =>
<div className={
  props.active ?
    'Player PActive'
    :
    'Player'
} onClick={() => props.setActivePlayer({name: props.player.name, steamid: props.player.steamid, team: props.player.team})}>
  <div className='PlayerName'>
    <a className='PlayerSteam' href={steamIDtoURL(props.player.steamid)} target='_blank'>
      <img src={require('../assets/images/icon_steam.svg')} alt='S' />
    </a>
    {props.player.name}
  </div>
  <div className='PlayerKills'>
    {props.player.kills}
  </div>
  <div className='PlayerAssists'>
    {props.player.assists}
  </div>
  <div className='PlayerDeaths'>
    {props.player.deaths}
  </div>
  <div className='PlayerHS'>
    {props.player.headshots}
  </div>
  <div className='PlayerADR'>
    {props.player.adr.toFixed(1)}
  </div>
  <div className='PlayerFK'>
    {props.player.firstkills}
  </div>
  <div className='PlayerCK'>
    {props.player.clutchkills}
  </div>
  <div className='PlayerAWP'>
    {props.player.awpkills}
  </div>
  <div className='Player3k'>
    {props.player.rounds3k}
  </div>
  <div className='Player4k'>
    {props.player.rounds4k}
  </div>
  <div className='Player5k'>
    {props.player.rounds5k}
  </div>
  <div className='PlayerFED'>
    {props.player.flashenemytime.toFixed(1)}
  </div>
  <div className='PlayerBP'>
    {props.player.bombsplanted}
  </div>
  <div className='PlayerBD'>
    {props.player.bombsdefused}
  </div>
</div>

export default Player;
