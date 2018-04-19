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
      isAsc: true,
    };
  }

  handleClick(i) {
    const reset = this.state.history[0];
    const history = this.state.isAsc ? this.state.history.slice(0, this.state.stepNumber + 1) : this.state.history.slice(-1 * this.state.stepNumber);
    this.state.isAsc || this.state.stepNumber === 0 ? history :history.unshift(reset);
    const currentIndex = this.state.isAsc || this.state.stepNumber === 0 ? this.state.stepNumber : history.length - this.state.stepNumber;
    const current = history[currentIndex];
    const squares = current.squares.slice();
    const player = this.state.xIsNext ? PLAYER_X : PLAYER_O;
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = player;

    if (this.state.isAsc) {
      history.push({
        squares: squares,
        position: i,
        player: player,
      });
    }
    else {
      history.splice(1, 0, {
        squares: squares,
        position: i,
        player: player,
      });
    }
    this.setState({
      history: history,
      stepNumber: this.state.isAsc ? history.length - 1 : this.state.stepNumber + 1,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(move) {
    this.setState({
      stepNumber: move,
      xIsNext: (move % 2) === 0,
    });
  }

  reverseHistoryMoves() {
    if (this.state.history && this.state.history.length > 1) {
      const history = this.state.history.slice(1);
      const reset = this.state.history[0];
      history.reverse();
      history.unshift(reset)
      this.setState({
        history: history,
        isAsc: !this.state.isAsc,
      });
    }
    else {
      this.setState({
        isAsc: !this.state.isAsc,
      });
      return;
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber === 0 ? 0 : this.state.isAsc ? this.state.stepNumber : this.state.history.length - this.state.stepNumber];

    const winner = current ? calculateWinner(current.squares) : null;
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((current, step) => {
      const desc = step ? calculateLocation(current) : 'Go to game start';
      const jumpTo = step === 0? 0 : this.state.isAsc ? step : this.state.history.length - step;
      return (
        <li key={step}>
          <Button value={desc} onClick={() => this.jumpTo(jumpTo)} className={jumpTo === this.state.stepNumber ? "bold-button" : ""} />
        </li>
      );
    });

    const sortButton = <Button value="Reverse" onClick={() => this.reverseHistoryMoves()} />

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
          <div>{sortButton}</div>
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