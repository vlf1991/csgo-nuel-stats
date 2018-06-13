import React from 'react';
import PropTypes from 'prop-types';
import Players from '../components/Players';

class PlayersContainer extends React.Component {
  componentDidMount() {
    if(!this.props.activePlayer && this.props.players) {
      this.props.setActivePlayer({name: this.props.players[0].name, steamid: this.props.players[0].steamid, team: this.props.players[0].team});
    }
  }
  render() {
    return (
      <Players
        activePlayer={this.props.activePlayer}
        setActivePlayer={this.props.setActivePlayer}
        players={this.props.players}
      />
    );
  }
}

PlayersContainer.propTypes = {
  activePlayer: PropTypes.string,
  setActivePlayer: PropTypes.func,
  players: PropTypes.array
};

export default PlayersContainer;
