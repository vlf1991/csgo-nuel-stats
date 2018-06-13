import React from 'react';
import PropTypes from 'prop-types';
import Round from '../components/Round';

class RoundContainer extends React.Component {
  render() {
    return (
      <Round
        {...this.props}
      />
    );
  }
}

RoundContainer.propTypes = {
  played: PropTypes.bool,
  teamswap: PropTypes.bool,
  won: PropTypes.bool,
  died: PropTypes.bool,
  plant: PropTypes.bool,
  defuse: PropTypes.bool,
  kills: PropTypes.number,
  headshots: PropTypes.number,
  assists: PropTypes.number
};

export default RoundContainer;
