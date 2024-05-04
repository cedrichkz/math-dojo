function generateQuestions(){
  const questions = [];
  for(let i = 0; i < numberOfQuestions; i++){
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    let operatorList = ['+', '*'];
    let operator = operatorList[Math.floor(Math.random() * operatorList.length)]; // Random operator
    let questionText = `${num1} ${operator} ${num2}`;
    let answer = eval(`${num1} ${operator} ${num2}`); // Evaluate correct answer
    questions.push({ question: questionText, answer: answer });
  }
  return questions;
}

let numberOfQuestions = 5;
let loadingTime = 3; // in seconds
let showResultTime = 2; // in seconds
const mathQuestions = generateQuestions();
let currentQuestionIndex = 0;
let correctAnswer;
let correctAnswers = 0;
let startTime, endTime;

// DOM elements
const homeScreen = document.getElementById("home-screen");
const gameScreen = document.getElementById("game-screen");
const loadScreen = document.getElementById("load-screen");
const resultScreen = document.getElementById("result-screen");
const scoreScreen = document.getElementById("score-screen");
const timerDisplay = document.getElementById("timer");
const timerContainer = document.getElementById("time-container");
const questionContainer = document.getElementById("question-container");
const questionDisplay = document.getElementById("question");
let userAnswerInput = document.getElementById("user-answer");
let resultMessage = document.getElementById("result");
let errorMessage = document.getElementById("error-message");
let scoreMessage = document.getElementById("score-message");

function startGame(){
    homeScreen.classList.add("hidden"); // hide homescreen
    loadScreen.classList.remove("hidden") // show loadscreen
    countDownScreen(loadingTime, timerDisplay, function() {
        loadScreen.classList.add("hidden"); // hide loadscreen
        startTime = new Date();
        displayQuestion();
    }); // start loading
}

function countDownScreen(duration, display, onComplete) {
    let timer = duration;

    display.textContent = timer; // Initial display

    let timerInterval = setInterval(function() {
        timer--;
        display.textContent = timer; // Update display

        if (timer <= 0) {
            clearInterval(timerInterval);
            if (onComplete && typeof onComplete === "function") {
                onComplete(); // Call the onComplete function
            }
        }
    }, 1000); // Update every second (1000 milliseconds)
}

function displayQuestion() {
  resultMessage.textContent = "";
  errorMessage.textContent = ""
  gameScreen.classList.remove("hidden") // show gamescreen elements
  questionDisplay.textContent = mathQuestions[currentQuestionIndex].question;
}

function checkAnswer() {
  let userAnswer = parseInt(userAnswerInput.value);
  let correctAnswer = mathQuestions[currentQuestionIndex].answer;

  if (isNaN(userAnswer)) { // check if user input is a number
    errorMessage.textContent = "Please enter a valid number!";
    userAnswerInput.value = "";
  } else {
    if (userAnswer === correctAnswer) {
       resultText = "Correct!";
       correctAnswers++;
    } else {
       resultText = "Incorrect! Correct answer: " + correctAnswer;
    }
    resultMessage.textContent = resultText;

    userAnswerInput.value = ""; // clean the user input
    gameScreen.classList.add("hidden"); // hide question screen
    resultScreen.classList.remove("hidden"); // show correct or incorrect screen

    setTimeout(function() { // after 2 seconds show new question or go to end scoreboard
      if (currentQuestionIndex < mathQuestions.length - 1){
        currentQuestionIndex++;
        displayQuestion();
      } else {
        endGame();
      }
    }, showResultTime * 1000); // 3000 milliseconds = 3 seconds
  }
}

function endGame (){ // transition result screen -> score screen
  endTime = new Date();
  resultScreen.classList.add("hidden"); // hide result screen
  scoreScreen.classList.remove("hidden");
  const totalTimeInSeconds = ((endTime - startTime) / 1000); // Calculate total time in seconds
  const answerTime = (totalTimeInSeconds - (showResultTime*numberOfQuestions)).toFixed(3)
  scoreMessage.textContent = `answers: ${correctAnswers}/${mathQuestions.length}`
  document.getElementById("time-message").textContent = "speed: " + answerTime + " seconds"
}

// Start the game when Start Game button is clicked
document.getElementById("start-btn").addEventListener("click", startGame);

// check answer when pressing the button
document.getElementById("submit-btn").addEventListener("click", checkAnswer);

//check answer when also pressing the enter key
document.getElementById("user-answer").addEventListener("keypress", function(event){
  if(event.key == "Enter"){
    checkAnswer();
  }
});

// handle back home link
document.getElementById("home-btn").addEventListener("click", function(event) {
    window.location.href = "index.html";
  });