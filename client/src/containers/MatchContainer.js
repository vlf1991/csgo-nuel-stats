import React from 'react';
import Match from '../components/Match';

class MatchContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePlayer: {
        name: null,
        steamid: null,
        team: 0
      },
      roundRange: {min: 1, max: 1}
    };
    this.setActivePlayer = this.setActivePlayer.bind(this);
    this.setRoundRange = this.setRoundRange.bind(this);
  }
  setActivePlayer(player) {
    this.setState({
      activePlayer: player
    });
  }
  setRoundRange(range) {
    this.setState({
      roundRange: range.value
    });
  }
  componentDidMount() {
    this.setRoundRange({value: {min: 1, max: this.props.logData.rounds.length}})
  }
  componentWillUpdate(nextProps) {
    if(nextProps.logData.rounds.length !== this.props.logData.rounds.length) {
      this.setRoundRange({value: {min: 1, max: nextProps.logData.rounds.length}})
    }
  }
  render() {
    return (
      <Match
        setRoundRange={this.setRoundRange}
        activePlayer={this.state.activePlayer.steamid}
        setActivePlayer={this.setActivePlayer}
        scores={roundRangeScore(this.props.logData.rounds, this.state.roundRange)}
        info={{
          organiser: this.props.logData.organiser,
          tournament: this.props.logData.tournament,
          date: this.props.logData.starttime,
          duration: this.props.logData.duration,
          map: this.props.logData.map,
          demo: this.props.logData.demo,
          team1: this.props.logData.team1.name,
          team2: this.props.logData.team2.name}}
        players={roundRange(this.props.logData.players, this.props.logData.rounds, this.state.roundRange)}
        rounds={minimiseRounds(this.props.logData.rounds)}
        player={roundRangePlayer(this.state.activePlayer, this.props.logData.rounds, this.state.roundRange)}
        playerrounds={fixPlayerRounds(this.props.logData.rounds, this.props.logData.players)}
      />
    );
  }
}

function minimiseRounds(rounds) {
  var newrounds = rounds.map((round, index) => {
    return {
      teamwon: round.teamwon,
      reason: round.reason
    };
  });
  return newrounds;
}

function fixPlayerRounds(rounds, players) {
  var playerrounds = {};

  Object.keys(players).forEach((steamid, index1) => {
    var newround = {}, thisplayer, k;
    var newrounds = rounds.map((round, index2) => {
      var hscount = 0;
      if(round['team1'].players.hasOwnProperty(steamid)) {
        thisplayer = round['team1'].players[steamid];
        for(k = 0; k < thisplayer.kills.length ; k++) {
          if(thisplayer.kills[k].headshot) hscount++;
        }
        newround = {
          played: true,
          teamswap: false,
          won: round.teamwon === 1 ? true : false,
          died: thisplayer.deaths > 0 ? true : false,
          plant: thisplayer.bombsplanted > 0 ? true : false,
          defuse: thisplayer.bombsdefused > 0 ? true : false,
          kills: thisplayer.kills.length,
          headshots: hscount,
          assists: thisplayer.assists,
          damage: thisplayer.damage,
          flashenemytime: thisplayer.flashenemytime
        };
        return newround;
      } else  if(round['team2'].players.hasOwnProperty(steamid)){
        thisplayer = round['team2'].players[steamid];
        for(k = 0; k < thisplayer.kills.length ; k++) {
          if(thisplayer.kills[k].headshot) hscount++;
        }
        newround = {
          played: true,
          teamswap: true,
          won: round.teamwon === 2 ? true : false,
          died: thisplayer.deaths > 0 ? true : false,
          plant: thisplayer.bombsplanted > 0 ? true : false,
          defuse: thisplayer.bombsdefused > 0 ? true : false,
          kills: thisplayer.kills.length,
          headshots: hscount,
          assists: thisplayer.assists,
          damage: thisplayer.damage,
          flashenemytime: thisplayer.flashenemytime
        };
        return newround;
      } else {
        return null;
      }
    });
    for(var i = newrounds.length; i < 30; i++) {
      newrounds.push({played: false});
    }
    playerrounds[steamid] = newrounds;
  });
  return playerrounds;
}

function roundRangeScore(rounds, range) {
  if(!rounds[range.max-1]) return roundRangeScore(rounds, {min: 1, max: 2});
  if(range.max === range.min) {
    return {
      team1: rounds[range.max-1].teamwon === 1 ? 1 : 0,
      team2: rounds[range.max-1].teamwon === 2 ? 1 : 0
    };
  } else if(range.min === 1) {
    return {
      team1: rounds[range.max-1].team1.score,
      team2: rounds[range.max-1].team2.score
    };
  } else {
    return {
      team1: rounds[range.max-1].team1.score - rounds[range.min-2].team1.score,
      team2: rounds[range.max-1].team2.score - rounds[range.min-2].team2.score
    };
  }
}

function roundRange(players, rounds, range) {
  if(!rounds[range.max-1]) return roundRange(players, rounds, {min: 1, max: 2});
  var newplayers = {}, playerKey, roundplayer, k;
  //Loop through each round to total up player scores
  for(var i = range.min-1 ; i < range.max ; i++) {
    //Loop through team 1
    for(playerKey in rounds[i].team1.players) {
      if(players.hasOwnProperty(playerKey)) {
        if(!newplayers.hasOwnProperty(playerKey)) {
          newplayers[playerKey] = {
            name: players[playerKey],
            steamid: playerKey,
            team: 1,
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
            rounds3k: 0,
            rounds4k: 0,
            rounds5k: 0
          };
        }
        roundplayer = rounds[i].team1.players[playerKey];
        newplayers[playerKey].kills += roundplayer.kills.length;
        newplayers[playerKey].assists += roundplayer.assists;
        newplayers[playerKey].deaths += roundplayer.deaths;
        newplayers[playerKey].damage += roundplayer.damage;
        for(k = 0; k < roundplayer.kills.length ; k++) {
          if(roundplayer.kills[k].headshot) newplayers[playerKey].headshots ++;
          if(roundplayer.kills[k].clutch && rounds[i].teamwon === 2) newplayers[playerKey].clutchkills ++;
          if(roundplayer.kills[k].firstkill) newplayers[playerKey].firstkills ++;
          if(roundplayer.kills[k].weapon === 'awp') newplayers[playerKey].awpkills ++;
        }
        //newplayer.pistolkills += roundplayer.pistolkills;
        newplayers[playerKey].flashenemytime += roundplayer.flashenemytime;
        newplayers[playerKey].bombsplanted += roundplayer.bombsplanted;
        newplayers[playerKey].bombsdefused += roundplayer.bombsdefused;
        newplayers[playerKey].roundsplayed ++;
        if(roundplayer.kills.length === 5) {
          newplayers[playerKey].rounds5k ++;
        } else if(roundplayer.kills.length === 4) {
          newplayers[playerKey].rounds4k ++;
        } else if(roundplayer.kills.length === 3) {
          newplayers[playerKey].rounds3k ++;
        }
        newplayers[playerKey].adr = newplayers[playerKey].damage/newplayers[playerKey].roundsplayed;
      }
    }
    //Loop through team 2
    for(playerKey in rounds[i].team2.players) {
      if(players.hasOwnProperty(playerKey)) {
        if(!newplayers.hasOwnProperty(playerKey)) {
          newplayers[playerKey] = {
            name: players[playerKey],
            steamid: playerKey,
            team: 2,
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
            rounds3k: 0,
            rounds4k: 0,
            rounds5k: 0
          };
        }
        roundplayer = rounds[i].team2.players[playerKey];
        newplayers[playerKey].kills += roundplayer.kills.length;
        newplayers[playerKey].assists += roundplayer.assists;
        newplayers[playerKey].deaths += roundplayer.deaths;
        newplayers[playerKey].damage += roundplayer.damage;
        for(k = 0; k < roundplayer.kills.length ; k++) {
          if(roundplayer.kills[k].headshot) newplayers[playerKey].headshots ++;
          if(roundplayer.kills[k].clutch && rounds[i].teamwon === 2) newplayers[playerKey].clutchkills ++;
          if(roundplayer.kills[k].firstkill) newplayers[playerKey].firstkills ++;
          if(roundplayer.kills[k].weapon === 'awp') newplayers[playerKey].awpkills ++;
        }
        //newplayer.pistolkills += roundplayer.pistolkills;
        newplayers[playerKey].flashenemytime += roundplayer.flashenemytime;
        newplayers[playerKey].bombsplanted += roundplayer.bombsplanted;
        newplayers[playerKey].bombsdefused += roundplayer.bombsdefused;
        newplayers[playerKey].roundsplayed ++;
        if(roundplayer.kills.length === 5) {
          newplayers[playerKey].rounds5k ++;
        } else if(roundplayer.kills.length === 4) {
          newplayers[playerKey].rounds4k ++;
        } else if(roundplayer.kills.length === 3) {
          newplayers[playerKey].rounds3k ++;
        }
        newplayers[playerKey].adr = newplayers[playerKey].damage/newplayers[playerKey].roundsplayed;
      }
    }
  }
  return newplayers;
}

function roundRangePlayer(player, rounds, range) {
  if(!rounds[range.max-1]) return roundRangePlayer(player, rounds, {min: 1, max: 2});
  var newplayer = {
    name: player.name,
    steamid: player.steamid,
    team: player.team,
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
  };
  if(player.steamid) {
    //Loop through each round to total up player scores
    for(var i = range.min-1 ; i < range.max ; i++) {
      if(rounds[i]['team'+player.team].players.hasOwnProperty(player.steamid)) {
        var roundplayer = rounds[i]['team'+player.team].players[player.steamid];
        newplayer.kills += roundplayer.kills.length;
        newplayer.assists += roundplayer.assists;
        newplayer.deaths += roundplayer.deaths;
        newplayer.damage += roundplayer.damage;
        for(var k = 0; k < roundplayer.kills.length ; k++) {
          if(roundplayer.kills[k].headshot) newplayer.headshots ++;
          if(roundplayer.kills[k].clutch && rounds[i].teamwon === 2) newplayer.clutchkills ++;
          if(roundplayer.kills[k].firstkill) newplayer.firstkills ++;
          if(roundplayer.kills[k].weapon === 'awp') newplayer.awpkills ++;
        }
        //newplayer.pistolkills += roundplayer.pistolkills;
        newplayer.flashenemytime += roundplayer.flashenemytime;
        newplayer.bombsplanted += roundplayer.bombsplanted;
        newplayer.bombsdefused += roundplayer.bombsdefused;
        newplayer.roundsplayed ++;
        /*if(roundplayer.kills.length === 5) {
          newplayers[playerKey].rounds5k ++;
        } else if(roundplayer.kills.length === 4) {
          newplayers[playerKey].rounds4k ++;
        } else if(roundplayer.kills.length === 3) {
          newplayers[playerKey].rounds3k ++;
        }*/
        newplayer.adr = newplayer.damage/newplayer.roundsplayed;
      }
    }
  }
  return newplayer;
}

export default MatchContainer;
