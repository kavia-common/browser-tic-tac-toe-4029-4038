import React, { useState, useEffect } from 'react';
import './App.css';

// Square (Cell) component
// PUBLIC_INTERFACE
function Square({ value, onClick, isWinning, disabled }) {
  return (
    <button
      className={`ttt-square${isWinning ? ' ttt-square--win' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Occupied by ${value}` : 'Empty cell'}
    >
      {value}
    </button>
  );
}

// Calculate winner utility
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // Theme support (preserved)
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Game State
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [isGameActive, setIsGameActive] = useState(true);
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  // Derived/computed board status
  useEffect(() => {
    const winner = calculateWinner(squares);
    if (winner) {
      setWinnerInfo(winner);
      setIsGameActive(false);
      setIsDraw(false);
    } else if (squares.every(Boolean)) {
      setIsDraw(true);
      setWinnerInfo(null);
      setIsGameActive(false);
    } else {
      setWinnerInfo(null);
      setIsDraw(false);
      setIsGameActive(true);
    }
  }, [squares]);

  // PUBLIC_INTERFACE
  const handleSquareClick = (i) => {
    if (!isGameActive || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinnerInfo(null);
    setIsGameActive(true);
    setIsDraw(false);
  };

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Status messaging
  let status;
  if (winnerInfo && winnerInfo.winner) {
    status = (
      <span className="ttt-status--win">
        Winner: <span className="ttt-status-player">{winnerInfo.winner}</span> 🎉
      </span>
    );
  } else if (isDraw) {
    status = <span className="ttt-status--draw">It's a draw! 🤝</span>;
  } else {
    status = (
      <span>
        Next turn: <span className="ttt-status-player">{xIsNext ? 'X' : 'O'}</span>
      </span>
    );
  }

  const getIsWinning = (idx) =>
    winnerInfo && winnerInfo.line && winnerInfo.line.includes(idx);

  return (
    <div className="App ttt-app-bg">
      <header className="App-header ttt-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-status">{status}</div>
        <div className="ttt-board">
          {[0, 1, 2].map(row =>
            <div className="ttt-board-row" key={row}>
              {[0, 1, 2].map(col => {
                const idx = row * 3 + col;
                return (
                  <Square
                    key={idx}
                    value={squares[idx]}
                    onClick={() => handleSquareClick(idx)}
                    isWinning={getIsWinning(idx)}
                    disabled={!!squares[idx] || !isGameActive}
                  />
                );
              })}
            </div>
          )}
        </div>
        <div className="ttt-controls">
          <button className="ttt-btn ttt-btn-reset" onClick={handleReset}>
            Reset
          </button>
        </div>
        <footer className="ttt-footer">
          <span>
            <a className="ttt-footer-link" href="https://github.com/topics/tic-tac-toe" target="_blank" rel="noopener noreferrer">
              Tic Tac Toe React Demo
            </a>
            &nbsp;|&nbsp;
            <span className="ttt-footer-author">© Kavia Demo</span>
          </span>
        </footer>
      </header>
    </div>
  );
}

export default App;
