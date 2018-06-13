import React from 'react';
import RoundEndIcon from './RoundEndIcon';

/*
  Props:
   ARRAY rounds
    OBJECT round
      INT teamwon: 1/2
      STRING reason: time/defuse/bomb/elim
      OBJECT team1
        INT score
        INT alive
        OBJECT players
          etc ... team2
*/

const RoundTimeline = (props) =>
<div className='RoundTimeline'>
  <div className='RTRounds' onClick={() => ''}>
    {
      props.rounds.map((round, index) => {
        return (
          <div key={index} className='RTRound'>
            <div className='RTRoundIcon'>
              {
                round.teamwon === 1 &&
                  <div className='RTRoundDivider'>&nbsp;</div>
              }

              <RoundEndIcon type={round.reason} teamwon={round.teamwon}  round={index+1} />
              {
                round.teamwon === 2 &&
                  <div className='RTRoundDivider'>&nbsp;</div>
              }
            </div>
          </div>
        );
      })
    }
  </div>
</div>

export default RoundTimeline;
