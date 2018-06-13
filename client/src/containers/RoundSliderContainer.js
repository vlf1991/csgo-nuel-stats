import React from 'react';
import PropTypes from 'prop-types';
import RoundSlider from '../components/RoundSlider';

class RoundSliderContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: { min: 1, max: props.rounds.length },
    };
    this.setValue = this.setValue.bind(this);
  }
  setValue(value) {
    this.setState(
      value
    );
  }
  render() {
    return (
      <RoundSlider
        setRoundRange={this.props.setRoundRange}
        rounds={this.props.rounds}
        value={this.state.value}
        setValue={this.setValue}
      />
    );
  }
}

RoundSliderContainer.propTypes = {
  setRoundRange: PropTypes.func,
  rounds: PropTypes.array,
};

export default RoundSliderContainer;
