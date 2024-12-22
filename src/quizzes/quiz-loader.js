import { generateTomlSnippet, setupCommentForm, loadQuizComments } from '../comment-utils.js';

// Import all available quizzes
import ArithmeticQuiz from './arithmetic/quiz.js';
import TriviaQuiz from './trivia/quiz.js';

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


async function startQuiz(quizId) {
    const QuizClass = AVAILABLE_QUIZZES[quizId];
    if (!QuizClass) return;

    const quiz = new QuizClass();
    const container = document.getElementById('quiz-content');
    const feedbackContainer = document.getElementById('quiz-feedback');
    const nextButton = document.getElementById('next-question');
    
    // Show quiz container and comments section
    document.getElementById('quiz-container').classList.remove('hidden');
    
    // Initialize comments section
    const commentsSection = document.getElementById('comments-section');
    commentsSection.classList.remove('hidden');
    
    // Load comments and setup form
    await loadQuizComments(quizId);
    await setupCommentForm(quizId);
    
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
