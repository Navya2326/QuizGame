// Game state
const gameState = {
    currentQuestionIndex: 0,
    score: 0,
    skipsRemaining: 3,
    correctAnswers: 0,
    wrongAnswers: 0,
    timerInterval: null,
    timeLeft: 60,
    questions: [],
    selectedOption: null
};

// DOM elements
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const skipBtn = document.getElementById('skip-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const timerContainer = document.getElementById('timer-container');
const timerElement = document.getElementById('timer');
const skipsRemainingElement = document.getElementById('skips-remaining');
const timerCircleFill = document.querySelector('.timer-circle-fill');
const finalScoreElement = document.getElementById('final-score');
const correctAnswersElement = document.getElementById('correct-answers');
const wrongAnswersElement = document.getElementById('wrong-answers');
const percentageElement = document.getElementById('percentage');
const skipsUsedElement = document.getElementById('skips-used');

// Questions will be loaded from questions.js
gameState.questions = [];

// Initialize the game
function initGame() {
    gameState.currentQuestionIndex = 0;
    gameState.score = 0;
    gameState.skipsRemaining = 3;
    gameState.correctAnswers = 0;
    gameState.wrongAnswers = 0;
    gameState.timeLeft = 60;
    gameState.selectedOption = null;

    skipsRemainingElement.textContent = gameState.skipsRemaining;
    skipBtn.textContent = `Skip (${gameState.skipsRemaining} left)`;
    timerContainer.classList.add('hidden');
    nextBtn.classList.add('hidden');
    loadQuestion();
}

// Load question
function loadQuestion() {
    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    optionsContainer.innerHTML = '';

    currentQuestion.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        optionElement.dataset.index = index;
        optionElement.addEventListener('click', selectOption);
        optionsContainer.appendChild(optionElement);
    });

    startTimer();
}

// Select option
function selectOption(e) {
    if (gameState.selectedOption !== null) return;

    const selectedIndex = parseInt(e.target.dataset.index);
    gameState.selectedOption = selectedIndex;
    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    
    // Highlight selected option
    e.target.classList.add('selected');

    // Check answer
    if (selectedIndex === currentQuestion.correctAnswer) {
        e.target.classList.add('correct');
        gameState.score += 10;
        gameState.correctAnswers++;
    } else {
        e.target.classList.add('wrong');
        gameState.score -= 5;
        gameState.wrongAnswers++;
        
        // Highlight correct answer
        const options = document.querySelectorAll('.option');
        options[currentQuestion.correctAnswer].classList.add('correct');
    }

    clearInterval(gameState.timerInterval);
    nextBtn.classList.remove('hidden');
}

// Skip question
function skipQuestion() {
    if (gameState.skipsRemaining <= 0) return;

    gameState.skipsRemaining--;
    skipsRemainingElement.textContent = gameState.skipsRemaining;
    skipBtn.textContent = `Skip (${gameState.skipsRemaining} left)`;
    
    clearInterval(gameState.timerInterval);
    nextQuestion();
}

// Next question
function nextQuestion() {
    gameState.currentQuestionIndex++;
    gameState.timeLeft = 60;
    gameState.selectedOption = null;
    nextBtn.classList.add('hidden');

    if (gameState.currentQuestionIndex < gameState.questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

// Start timer
function startTimer() {
    timerContainer.classList.remove('hidden');
    gameState.timeLeft = 60;
    timerElement.textContent = gameState.timeLeft;
    timerCircleFill.style.strokeDashoffset = 283;

    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        timerElement.textContent = gameState.timeLeft;
        
        // Update circle progress
        const progress = (gameState.timeLeft / 60) * 283;
        timerCircleFill.style.strokeDashoffset = progress;

        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timerInterval);
            timeUp();
        }
    }, 1000);
}

// Time up
function timeUp() {
    gameState.score -= 5;
    gameState.wrongAnswers++;
    nextBtn.classList.remove('hidden');
}

// Show results
function showResults() {
    quizScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');

    const percentage = Math.round((gameState.correctAnswers / gameState.questions.length) * 100);
    const skipsUsed = 3 - gameState.skipsRemaining;

    finalScoreElement.textContent = gameState.score;
    correctAnswersElement.textContent = gameState.correctAnswers;
    wrongAnswersElement.textContent = gameState.wrongAnswers;
    percentageElement.textContent = `${percentage}%`;
    skipsUsedElement.textContent = skipsUsed;
}

// Event listeners
startBtn.addEventListener('click', () => {
    welcomeScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    initGame();
});

skipBtn.addEventListener('click', skipQuestion);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', () => {
    resultsScreen.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load questions from external file
    const script = document.createElement('script');
    script.src = 'questions.js';
    document.head.appendChild(script);
});
