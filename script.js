// Programming Quiz Questions
const questions = [
    {
        question: "What does the 'DOM' stand for in web development?",
        options: [
            "Document Object Model",
            "Data Object Management",
            "Digital Output Mechanism",
            "Display Orientation Module"
        ],
        answer: 0
    },
    {
        question: "Which operator is used for strict equality comparison in JavaScript?",
        options: ["==", "===", "=", "!=="],
        answer: 1
    },
    {
        question: "What is the output of 'console.log(typeof [])' in JavaScript?",
        options: ["array", "object", "list", "undefined"],
        answer: 1
    },
    {
        question: "Which method adds one or more elements to the end of an array?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        answer: 0
    },
    {
        question: "What does CSS stand for?",
        options: [
            "Cascading Style Sheets",
            "Computer Style Sheets",
            "Creative Style System",
            "Colorful Style Syntax"
        ],
        answer: 0
    },
    {
        question: "Which keyword is used to declare a constant in JavaScript?",
        options: ["let", "var", "const", "static"],
        answer: 2
    },
    {
        question: "What is the purpose of the 'this' keyword in JavaScript?",
        options: [
            "Refers to the current function",
            "Refers to the parent object",
            "Refers to the global object",
            "Refers to the current object context"
        ],
        answer: 3
    },
    {
        question: "Which HTML tag is used to include JavaScript code?",
        options: ["<script>", "<javascript>", "<js>", "<code>"],
        answer: 0
    },
    {
        question: "What is the correct way to create a function in JavaScript?",
        options: [
            "function = myFunction()",
            "function myFunction()",
            "create myFunction()",
            "new function myFunction()"
        ],
        answer: 1
    },
    {
        question: "Which method converts a JSON string to a JavaScript object?",
        options: [
            "JSON.parse()",
            "JSON.stringify()",
            "JSON.convert()",
            "JSON.toObject()"
        ],
        answer: 0
    }
];

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const questionElement = document.querySelector('.question');
const optionsElement = document.querySelector('.options');
const timerElement = document.querySelector('.timer');
const skipBtn = document.getElementById('skip-btn');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');
const scoreElement = document.querySelector('.score');
const scoreValue = document.querySelector('.score-value');
const totalQuestions = document.querySelector('.total-questions');
const skipCountElement = document.getElementById('skip-count');
const startBtn = document.getElementById('start-btn');

// Quiz variables
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;
let quizActive = false;
let skipsRemaining = 3;
let userAnswers = [];

// Initialize quiz
function initQuiz() {
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    currentQuestionIndex = 0;
    score = 0;
    skipsRemaining = 3;
    userAnswers = [];
    quizActive = true;
    scoreElement.classList.add('hidden');
    totalQuestions.textContent = questions.length;
    skipCountElement.textContent = skipsRemaining;
    loadQuestion();
}

// Load question
function loadQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    
    currentQuestion.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option', 'bg-white', 'border', 'border-gray-300', 'rounded-md', 'p-3', 'cursor-pointer', 'hover:border-blue-500');
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => selectOption(index));
        optionsElement.appendChild(optionElement);
    });

    startTimer();
}

// Timer functionality
function startTimer() {
    timeLeft = 30;
    timerElement.textContent = timeLeft;
    timerElement.classList.remove('warning', 'danger');
    
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 10) {
            timerElement.classList.add('warning');
        }
        if (timeLeft <= 5) {
            timerElement.classList.remove('warning');
            timerElement.classList.add('danger');
        }
        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(-1); // -1 indicates time ran out
        }
    }, 1000);
}

// Reset options
function resetState() {
    clearInterval(timer);
    optionsElement.innerHTML = '';
    submitBtn.disabled = true;
}

// Select option
function selectOption(index) {
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    options[index].classList.add('selected');
    submitBtn.disabled = false;
}

// Check answer
function checkAnswer(selectedIndex) {
    clearInterval(timer);
    quizActive = false;
    
    const correctIndex = questions[currentQuestionIndex].answer;
    const options = document.querySelectorAll('.option');
    
    if (selectedIndex === correctIndex) {
        score++;
        options[selectedIndex].classList.add('bg-green-100', 'border-green-500');
    } else if (selectedIndex >= 0) {
        options[selectedIndex].classList.add('bg-red-100', 'border-red-500');
        options[correctIndex].classList.add('bg-green-100', 'border-green-500');
    } else {
        options[correctIndex].classList.add('bg-green-100', 'border-green-500');
    }

    userAnswers.push({
        questionIndex: currentQuestionIndex,
        userAnswer: selectedIndex,
        isCorrect: selectedIndex === correctIndex
    });

    scoreValue.textContent = score;
    submitBtn.disabled = true;
    
    // Move to next question after delay
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            quizActive = true;
            loadQuestion();
        } else {
            endQuiz();
        }
    }, 1500);
}

// End quiz
function endQuiz() {
    quizActive = false;
    clearInterval(timer);
    questionElement.textContent = "Quiz Completed!";
    optionsElement.innerHTML = '';
    
    // Display results
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'text-left';
    
    userAnswers.forEach((answer, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'mb-4 p-3 border-b border-gray-200';
        
        const questionText = document.createElement('p');
        questionText.className = 'font-semibold';
        questionText.textContent = `Q${index + 1}: ${questions[index].question}`;
        
        const userAnswer = document.createElement('p');
        userAnswer.className = answer.isCorrect ? 'text-green-600' : 'text-red-600';
        userAnswer.textContent = `Your answer: ${questions[index].options[answer.userAnswer] || 'Skipped'}`;
        
        const correctAnswer = document.createElement('p');
        correctAnswer.className = 'text-blue-600';
        correctAnswer.textContent = `Correct answer: ${questions[index].options[questions[index].answer]}`;
        
        resultItem.appendChild(questionText);
        resultItem.appendChild(userAnswer);
        resultItem.appendChild(correctAnswer);
        resultsContainer.appendChild(resultItem);
    });

    optionsElement.appendChild(resultsContainer);
    
    timerElement.textContent = '✓';
    timerElement.classList.remove('warning', 'danger');
    timerElement.classList.add('bg-green-100', 'text-green-800');
    scoreElement.classList.remove('hidden');
}

// Event listeners
skipBtn.addEventListener('click', () => {
    if (!quizActive || skipsRemaining <= 0) return;
    
    skipsRemaining--;
    skipCountElement.textContent = skipsRemaining;
    userAnswers.push({
        questionIndex: currentQuestionIndex,
        userAnswer: null,
        isCorrect: false,
        skipped: true
    });
    
    if (skipsRemaining <= 0) {
        skipBtn.disabled = true;
        skipBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
    
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
});

submitBtn.addEventListener('click', () => {
    if (!quizActive) return;
    const selectedOption = document.querySelector('.option.selected');
    if (selectedOption) {
        const options = document.querySelectorAll('.option');
        const selectedIndex = Array.from(options).indexOf(selectedOption);
        checkAnswer(selectedIndex);
    }
});

restartBtn.addEventListener('click', initQuiz);
startBtn.addEventListener('click', initQuiz);

// Initialize skip button state
skipBtn.disabled = false;
skipBtn.classList.remove('opacity-50', 'cursor-not-allowed');
