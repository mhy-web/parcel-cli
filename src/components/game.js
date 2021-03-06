import React from 'react';
import ReactDOM from 'react-dom';
import {Board} from './board';
import calculateWinner from '../lib/calcalateWinner';

export default class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastStep: 'Game start',
      }],
      xIsNext: true,
      stepNumber: 0,
      sort: false,
    };
  }
  handleClick(i) {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const location = '(' + (Math.floor(i/3)+1) + ',' + ((i%3)+1) + ')';
    const desc = squares[i] + 'moved to ' + location;
    this.setState({
      history: history.concat([{
        squares: squares,
        lastStep: desc,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    })
  }
  toggleSort() {
    this.setState({
      sort: !this.state.sort,
    })
  }
  
  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares).winner;
    const winnerLine = calculateWinner(current.squares).line;

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    if(this.state.sort) {
      history = this.state.history.slice();
      history.reverse();
    }

    const moves = history.map((step,move) => {
      const desc = step.lastStep;
      if (move == this.state.stepNumber) {
        return (
          <li key={move}>
            <a href="#" onClick={() => this.jumpTo(move)}><strong>{desc}</strong></a>
          </li>
        );
      }
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)} winnerLine={winnerLine} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleSort()}><strong>Sort</strong></button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  } 
}
