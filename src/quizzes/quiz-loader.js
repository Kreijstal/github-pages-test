// Import all available quizzes
import ArithmeticQuiz from './arithmetic.js';
import TriviaQuiz from './trivia.js';

const AVAILABLE_QUIZZES = {
    'arithmetic': ArithmeticQuiz,
    'trivia': TriviaQuiz
};

function loadQuizList() {
    const container = document.getElementById('quiz-list');
    
    Object.entries(AVAILABLE_QUIZZES).forEach(([id, QuizClass]) => {
        const quiz = new QuizClass();
        const element = document.createElement('div');
        element.className = 'quiz-item';
        element.innerHTML = `
            <h2>${quiz.name}</h2>
            <p>${quiz.description}</p>
            <button onclick="startQuiz('${id}')">Start Quiz</button>
        `;
        container.appendChild(element);
    });
}

function startQuiz(quizId) {
    const QuizClass = AVAILABLE_QUIZZES[quizId];
    if (!QuizClass) return;

    const quiz = new QuizClass();
    const container = document.getElementById('quiz-content');
    const feedbackContainer = document.getElementById('quiz-feedback');
    const nextButton = document.getElementById('next-question');
    
    document.getElementById('quiz-container').classList.remove('hidden');
    document.getElementById('comments-section').classList.remove('hidden');
    
    function setupQuestion() {
        feedbackContainer.classList.add('hidden');
        nextButton.classList.add('hidden');
        quiz.display(container);
        
        const checkButton = container.querySelector('#check-answer');
        checkButton.onclick = () => {
            const isCorrect = quiz.evaluate();
            feedbackContainer.classList.remove('hidden');
            
            if (isCorrect) {
                feedbackContainer.innerHTML = '<div class="correct">Correct!</div>';
            } else {
                quiz.showAnswer(feedbackContainer);
            }
            
            nextButton.classList.remove('hidden');
        };
    }
    
    nextButton.onclick = setupQuestion;
    setupQuestion(); // Show first question
}

window.startQuiz = startQuiz;
window.onload = loadQuizList;
