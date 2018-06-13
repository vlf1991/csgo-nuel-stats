import React from 'react';
import PropTypes from 'prop-types';
import PartBot from '../components/PartBot';

class PartBotContainer extends React.Component {
  render() {
    return (
      <PartBot
        {...this.props}
      />
    );
  }
}

export default PartBotContainer;
