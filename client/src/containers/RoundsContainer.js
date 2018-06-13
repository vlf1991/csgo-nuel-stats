import React from 'react';
import PropTypes from 'prop-types';
import Rounds from '../components/Rounds';

class RoundsContainer extends React.Component {
  render() {
    return (
      <Rounds
        {...this.props}
      />
    );
  }
}

RoundsContainer.propTypes = {
  activePlayer: PropTypes.shape({
    steamid: PropTypes.string,
    name: PropTypes.name
  }),
  playerrounds: PropTypes.array
};

export default RoundsContainer;
