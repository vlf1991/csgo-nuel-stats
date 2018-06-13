import React from 'react';
import PropTypes from 'prop-types';
import PartTop from '../components/PartTop';

class PartTopContainer extends React.Component {
  render() {
    return (
      <PartTop
        {...this.props}
      />
    );
  }
}

export default PartTopContainer;
