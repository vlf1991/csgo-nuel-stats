import React from 'react';
import PropTypes from 'prop-types';
import Player from '../components/Player';

class PlayerContainer extends React.Component {
  render() {
    return (
      <Player
        {...this.props}
      />
    );
  }
}

PlayerContainer.propTypes = {
  active: PropTypes.bool,
  setActivePlayer: PropTypes.func,
  player: PropTypes.shape({
    name: PropTypes.string,
    steamid: PropTypes.string,
    team: PropTypes.number,
    kills: PropTypes.number,
    assists: PropTypes.number,
    deaths: PropTypes.number,
    headshots: PropTypes.number,
    clutchkills: PropTypes.number,
    firstkills: PropTypes.number,
    awpkills: PropTypes.number,
    damage: PropTypes.number,
    roundsplayed: PropTypes.number,
    flashenemytime: PropTypes.number,
    bombsplanted: PropTypes.number,
    bombsdefused: PropTypes.number,
    adr: PropTypes.number,
  })
};

export default PlayerContainer;
