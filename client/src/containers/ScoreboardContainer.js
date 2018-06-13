import React from 'react';
import PropTypes from 'prop-types';
import Scoreboard from '../components/Scoreboard';

function fixPlayers(players) {
  var newplayers = [];
  for(var player in players) {
    newplayers.push(players[player]);
  }
  return newplayers.sort(function(a, b) {
    return b['team'] - a['team'] || b['kills'] - a['kills'];
  });
}

class ScoreboardContainer extends React.Component {
  render() {
    return (
      <Scoreboard
        activePlayer={this.props.activePlayer}
        setActivePlayer={this.props.setActivePlayer}
        players={fixPlayers(this.props.players)}
        scores={this.props.scores}
        teamnames={this.props.teamnames}
      />
    );
  }
}

ScoreboardContainer.propTypes = {
  activePlayer: PropTypes.string,
  setActivePlayer: PropTypes.func,
  players: PropTypes.object,
  scores: PropTypes.shape({
    team1: PropTypes.number,
    team2: PropTypes.number
  }),
  teamnames: PropTypes.shape({
    team1: PropTypes.string,
    team2: PropTypes.string
  })
};

export default ScoreboardContainer;
