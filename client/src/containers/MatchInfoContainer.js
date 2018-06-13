import React from 'react';
import PropTypes from 'prop-types';
import MatchInfo from '../components/MatchInfo';

class MatchInfoContainer extends React.Component {
  render() {
    return (
      <MatchInfo
        {...this.props}
      />
    );
  }
}

MatchInfoContainer.propTypes = {
  organiser: PropTypes.string,
  tournament: PropTypes.string,
  date: PropTypes.number,
  duration: PropTypes.number,
  map: PropTypes.string,
  demo: PropTypes.string,
  team1: PropTypes.string,
  team2: PropTypes.string
};

export default MatchInfoContainer;
