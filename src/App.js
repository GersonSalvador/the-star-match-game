import React, {useState, useEffect} from 'react';
import './App.css';

const StarsDisplay = props => (
	<>
    {utils.range(1, props.count).map(starId =>
      <div key={starId} className="star" />
    )}
  </>
);

const PlayNumber = props => (
	<button 
    className="number" 
    style={{backgroundColor: colors[props.status]}}
    onClick={() => props.onClick( props.number, props.status)}
  >
    {props.number}
  </button>
);

const PLayAgain = props => (
  <div className="game-done">
    <div 
      className="message"
      style={{color: props.gameStatus === 'lost' ? 'red' : 'green'}}
    >
      {props.gameStatus === 'lost' ? 'Game Over' : 'Well Done!'}
    </div>
    <button onClick={() => props.reSet()}>Play Again</button>
  </div>
)

const Game = props => {
	const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1,9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1000)

  const vandidatesAreWrong = utils.sum(candidateNums) > stars;
  const gameStatus = !availableNums.length
    ? 'won'
    : timeLeft === 0 ? 'lost' : 'active'

  useEffect(() => {
    if(timeLeft > 0 && availableNums.length > 0){
      const timerid = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 10)
      return () => clearTimeout(timerid)
    }
  })
  
  const numberStatus = number => {
    if(!availableNums.includes(number))
      return 'used';
    if(candidateNums.includes(number))
      return vandidatesAreWrong ? 'wrong' : 'candidate'
    return 'available';
  }

  const onNumberClick = (number, currentStatus) => {
    if(gameStatus !== 'active' || currentStatus === 'used')
      return;
    const newCandidateNums = currentStatus === 'available' ? candidateNums.concat(number) : candidateNums.filter(n => n !== number)
    if(utils.sum(newCandidateNums) !== stars)
      setCandidateNums(newCandidateNums)
    else{
      const newAvailableNums = availableNums.filter(n => !newCandidateNums.includes(n));
      setStars(utils.randomSumIn(newAvailableNums,9))
      setAvailableNums(newAvailableNums)
      setCandidateNums([])
    }
  }
  
  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
        {
          gameStatus !== 'active' ? <PLayAgain reSet={props.startNewGame} gameStatus={gameStatus}/> : <StarsDisplay count={stars}/>
        }
        </div>
        <div className="right">
        	{utils.range(1, 9).map(number =>
          	<PlayNumber 
              key={number} 
              status={numberStatus(number)}
              number={number}
              onClick={onNumberClick}
            />
          )}
        </div>
      </div>
      <div className="timer">Time Remaining: {(timeLeft/100).toFixed(2)}</div>
    </div>
  );
};

// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

// Math science
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

const StarMatch = () => {
  const [gameId,setGameId] = useState(1)
  return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)}/>
}

function App() {
  return (
    <StarMatch />
  );
}

export default App;