import React from 'react';
import Match from '../containers/MatchContainer';
import logData from '../kotnq2f0';
import lancaster11 from '../lanc/week1-game1';
import lancaster12 from '../lanc/week1-game2';
import lancaster21 from '../lanc/week2-game1';
import lancaster22 from '../lanc/week2-game2';
import lancaster31 from '../lanc/week3-game1';
import lancaster41 from '../lanc/week4-game1';
import lancaster42 from '../lanc/week4-game2';
import lancaster51 from '../lanc/week5-game1';
import lancaster52 from '../lanc/week5-game2';
import lancaster61 from '../lanc/week6-game1';
import lancaster62 from '../lanc/week6-game2';
import warwick11 from '../ww/week1-game1';
import warwick12 from '../ww/week1-game2';
import warwick21 from '../ww/week2-game1';
import warwick22 from '../ww/week2-game2';
import warwick31 from '../ww/week3-game1';
import warwick32 from '../ww/week3-game2';
import warwick41 from '../ww/week4-game1';
import warwick42 from '../ww/week4-game2';
import warwick51 from '../ww/week5-game1';
import warwick52 from '../ww/week5-game2';
import warwick62 from '../ww/week6-game2';
import warwick71 from '../ww/week7-game1';
import warwick72 from '../ww/week7-game2';

//var logData = require('../lanc/week3-game1.js').default;

function getLog(team, w, g) {
  if(team === 'lancaster') {
    if(g === 1) {
      switch(w) {
        case 1:
        return lancaster11;
        case 2:
        return lancaster21;
        case 3:
        return lancaster31;
        case 4:
        return lancaster41;
        case 5:
        return lancaster51;
        case 6:
        return lancaster61;
        default:
        return lancaster31;
      }
    } else {
      switch(w) {
        case 1:
        return lancaster12;
        case 2:
        return lancaster22;
        case 4:
        return lancaster42;
        case 5:
        return lancaster52;
        case 6:
        return lancaster62;
        default:
        return lancaster31;
      }
    }
  } else {
    if(g === 1) {
      switch(w) {
        case 1:
        return warwick11;
        case 2:
        return warwick21;
        case 3:
        return warwick31;
        case 4:
        return warwick41;
        case 5:
        return warwick51;
        case 7:
        return warwick71;
        default:
        return warwick31;
      }
    } else {
      switch(w) {
        case 1:
        return warwick12;
        case 2:
        return warwick22;
        case 3:
        return warwick32;
        case 4:
        return warwick42;
        case 5:
        return warwick52;
        case 6:
        return warwick62;
        case 7:
        return warwick72;
        default:
        return warwick31;
      }
    }
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = { logData: logData };
  }
  setGame(team, w, g) {
    this.setState({
      logData: getLog(team,w,g)
    });
  }
  render() {
    return(
      <div className='Main'>
        <div className='wwlanc'>
          <div onClick={() => this.setGame('lancaster', 1, 1)}>
            Lancaster Week 1 Game 1
          </div>
          <div onClick={() => this.setGame('lancaster', 1, 2)}>
            Lancaster Week 1 Game 2
          </div>
          <div onClick={() => this.setGame('lancaster', 2, 1)}>
            Lancaster Week 2 Game 1
          </div>
          <div onClick={() => this.setGame('lancaster', 2, 2)}>
            Lancaster Week 2 Game 2
          </div>
          <div onClick={() => this.setGame('lancaster', 3, 1)}>
            Lancaster Week 3 Game 1
          </div>
          <div onClick={() => this.setGame('lancaster', 4, 1)}>
            Lancaster Week 4 Game 1
          </div>
          <div onClick={() => this.setGame('lancaster', 4, 2)}>
            Lancaster Week 4 Game 2
          </div>
          <div onClick={() => this.setGame('lancaster', 5, 1)}>
            Lancaster Week 5 Game 1
          </div>
          <div onClick={() => this.setGame('lancaster', 5, 2)}>
            Lancaster Week 5 Game 2
          </div>
          <div onClick={() => this.setGame('lancaster', 6, 1)}>
            Lancaster Week 6 Game 1
          </div>
          <div onClick={() => this.setGame('lancaster', 6, 2)}>
            Lancaster Week 6 Game 2
          </div>
          <div onClick={() => this.setGame('warwick', 1, 1)}>
            Warwick Week 1 Game 1
          </div>
          <div onClick={() => this.setGame('warwick', 1, 2)}>
            Warwick Week 1 Game 2
          </div>
          <div onClick={() => this.setGame('warwick', 2, 1)}>
            Warwick Week 2 Game 1
          </div>
          <div onClick={() => this.setGame('warwick', 2, 2)}>
            Warwick Week 2 Game 2
          </div>
          <div onClick={() => this.setGame('warwick', 3, 1)}>
            Warwick Week 3 Game 1
          </div>
          <div onClick={() => this.setGame('warwick', 3, 2)}>
            Warwick Week 3 Game 2
          </div>
          <div onClick={() => this.setGame('warwick', 4, 1)}>
            Warwick Week 4 Game 1
          </div>
          <div onClick={() => this.setGame('warwick', 4, 2)}>
            Warwick Week 4 Game 2
          </div>
          <div onClick={() => this.setGame('warwick', 5, 1)}>
            Warwick Week 5 Game 1
          </div>
          <div onClick={() => this.setGame('warwick', 5, 2)}>
            Warwick Week 5 Game 2
          </div>
          <div onClick={() => this.setGame('warwick', 6, 2)}>
            Warwick Week 6 Game 2
          </div>
          <div onClick={() => this.setGame('warwick', 7, 1)}>
            Warwick Week 7 Game 1
          </div>
          <div onClick={() => this.setGame('warwick', 7, 2)}>
            Warwick Week 7 Game 2
          </div>
        </div>
        <Match logData={this.state.logData} />
      </div>
    );
  }
}

export default Main;
