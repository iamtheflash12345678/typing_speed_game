const sampleText = "Global warming is the increase in Earth's average temperature caused by greenhouse gas emissions from human activities. It leads to climate change, rising sea levels, and more extreme weather events.";
const textDisplay = document.getElementById('text');
const input = document.getElementById('input');
const startBtn = document.getElementById('start');
const endTurnBtn = document.getElementById('endTurn');
const endGameBtn = document.getElementById('endGame');
const restartBtn = document.getElementById('restart');
const scoreSpan = document.getElementById('score');
const timeSpan = document.getElementById('time');
const scoreboardBody = document.querySelector('#scoreboard tbody');
const statusMsg = document.getElementById('statusMsg');

let userCount = 1;
let currentScore = 0;
let gameStarted = false;
let timer = null;
let timeLeft = 60;
let totalTime = 60;

const scoreboardData = [];

function startGame() {
  if (!gameStarted) {
    input.disabled = false;
    input.value = "";
    input.placeholder = "Start typing here...";
    input.focus();
    textDisplay.textContent = sampleText;
    currentScore = 0;
    scoreSpan.textContent = currentScore;
    statusMsg.textContent = `User ${userCount}'s turn`;
    gameStarted = true;
    startBtn.disabled = true;
    endTurnBtn.disabled = false;
    endGameBtn.disabled = false;
    timeLeft = 60;
    totalTime = 60;
    timeSpan.textContent = timeLeft;

    timer = setInterval(() => {
      timeLeft--;
      timeSpan.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timer);
        evaluateScore("Time Up");
      }
    }, 1000);
  }
}

function endTurn() {
  if (gameStarted) {
    clearInterval(timer);
    evaluateScore("Turn Ended");
  }
}

function evaluateScore(reason) {
  const typedWords = input.value.trim().split(/\s+/);
  const correctWords = sampleText.split(" ");
  const timeTaken = 60 - timeLeft;

  let score = 0;
  for (let i = 0; i < Math.min(typedWords.length, correctWords.length); i++) {
    if (typedWords[i] === correctWords[i]) {
      score++;
    }
  }

  const rawWords = input.value.trim().split(/\s+/).filter(word => word.length > 0);
  let wpm = 0;
  if (input.value.trim() === "") {
    score = 0;
    wpm = 0;
    statusMsg.textContent = `User ${userCount} forfeited.`;
  } else {
    wpm = Math.round((rawWords.length / timeTaken) * 60) || 0;
    statusMsg.textContent = `User ${userCount} ended the turn (${reason}).`;
  }

  scoreSpan.textContent = score;
  appendToScoreboard(userCount, score, wpm);

  scoreboardData.push({ user: `User ${userCount}`, score, wpm });

  userCount++;
  gameStarted = false;
  input.disabled = true;
  startBtn.disabled = false;
  endTurnBtn.disabled = true;
}

function appendToScoreboard(user, score, wpm) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>User ${user}:</td>
    <td>${score}</td>
    <td>${wpm}</td>
  `;
  scoreboardBody.appendChild(row);
}

function endGameForAll() {
  clearInterval(timer);
  gameStarted = false;
  input.disabled = true;
  input.value = "";
  input.placeholder = "Game Over";
  startBtn.disabled = true;
  endTurnBtn.disabled = true;
  endGameBtn.disabled = true;

  // Find winner by highest score
  if (scoreboardData.length > 0) {
    const maxScore = Math.max(...scoreboardData.map(user => user.score));
    const winners = scoreboardData.filter(user => user.score === maxScore);

    if (winners.length === 1) {
      statusMsg.textContent = `🏆 Winner: ${winners[0].user} with ${winners[0].score} points and ${winners[0].wpm} WPM 🎉`;
    } else {
      const names = winners.map(w => w.user).join(", ");
      statusMsg.textContent = `🏆 Tie between: ${names} with ${maxScore} points 🎉`;
    }
  } else {
    statusMsg.textContent = "Game ended. No users played.";
  }
}

function restartGame() {
  location.reload(); // hard reset
}

startBtn.addEventListener('click', startGame);
endTurnBtn.addEventListener('click', endTurn);
endGameBtn.addEventListener('click', endGameForAll);
restartBtn.addEventListener('click', restartGame);
