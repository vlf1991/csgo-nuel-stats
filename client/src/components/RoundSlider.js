import React from 'react';
import InputRange from 'react-input-range';
import RoundEndIcon from './RoundEndIcon';

const RoundSlider = (props) =>
<div className='RoundSlider'>
  <div className='RSRounds'>
    {
      props.rounds.map((round, index) => {
        return (
          <div key={index} className='RSRound'>
            <div className={
              index+1 >= props.value.min && index+1 <= props.value.max ?
              'RSRoundIcon RSActive'
              :
              'RSRoundIcon'
            }>
              <div className={
                round.teamwon === 2 ?
                    'RSTopHalf'
                  :
                    'RSBotHalf'
              }>
                <RoundEndIcon type={round.reason} teamwon={round.teamwon}  round={index+1} />
              </div>
            </div>
          </div>
        );
      })
    }
  </div>
  <InputRange
    maxValue={props.rounds.length}
    minValue={1}
    value={props.value}
    allowSameValues={true}
    onChange={value => props.setValue({ value })}
    onChangeComplete={value => props.setRoundRange({ value })} />
</div>

export default RoundSlider;
