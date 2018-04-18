import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

const PLAYER_X = 'X';
const PLAYER_O = 'O';

function Square (props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)} 
      />
    );
  }

  render() {
    var board = [];
    for (var i = 0; i < 3; i++) {
      var items = [];
      for (var j = 0; j < 3; j++) {
        items.push(this.renderSquare(i * 3 + j))
      }
     board.push(<div className="board-row">{items}</div>);
    }
    return (
      <div>
        {board}
      </div>
    );
  }
}

function Button(props) {
  return (<button 
    onClick={() => props.onClick()} 
    class={props.className}
  >
  {props.value}
  </button>);
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        position: -1,
        player: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length -1];
    const squares = current.squares.slice();
    const player = this.state.xIsNext ? PLAYER_X : PLAYER_O;
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = player;
    this.setState({
      history: history.concat([{
        squares: squares,
        position: i,
        player: player
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(move) {
    this.setState({
      stepNumber: move,
      xIsNext: (move % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const winner = calculateWinner(current.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((current, step) => {
      const desc = step ? calculateLocation(current) : 'Go to game start';
      return (
        <li key={step}>
          <Button value={desc} onClick={() => this.jumpTo(step)} className={step === this.state.stepNumber ? "bold-button" : ""} />
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares= {current.squares} 
            onClick={(i) => this.handleClick(i)} 
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const possibles = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < possibles.length; i++) {
    const [a, b, c] = possibles[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function calculateLocation(current) {
  const position = current.position;
  const player = current.player;
  const x = (Math.floor(position / 3) + 1).toFixed(0);
  const y = (position % 3 + 1).toFixed(0);
  return player + ' chose (' + x + ', ' + y + ')';
}