import React from 'react';
import PropTypes from 'prop-types';
import PlayerInfo from '../components/PlayerInfo';

class PlayerInfoContainer extends React.Component {
  render() {
    return (
      <PlayerInfo
        {...this.props}
      />
    );
  }
}

PlayerInfoContainer.propTypes = {
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
};

export default PlayerInfoContainer;
