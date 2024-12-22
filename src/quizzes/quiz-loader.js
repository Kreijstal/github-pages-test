import { generateTomlSnippet, setupCommentForm, loadComments, CommentPersonalizationAPI } from '../comment-utils.js';

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
    
    // Set up the edit URL for comments
    const editUrl = `https://github.com/Kreijstal/github-pages-test/edit/master/src/quizzes/${quizId}/comments.toml`;
    const editLink = document.getElementById('edit-comments-link');
    if (editLink) {
        editLink.dataset.editUrl = editUrl;
    }
    
    // Load comments and setup form
    const quizPersonalization = new CommentPersonalizationAPI({
        headerText: "How was this quiz?",
        subheaderText: "Let us know your thoughts in the comments below!",
        formTitle: "Share Your Quiz Experience",
        previewTitle: "Preview Your Comment",
        contributionText: "Want to help improve this quiz? You can contribute by:"
    });
    
    await loadComments(`${quizId}/comments.toml`, quizPersonalization);
    await setupCommentForm();
    
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
                if (quiz.moveToNextQuestion()) {
                    nextButton.classList.remove('hidden');
                } else {
                    feedbackContainer.innerHTML += '<p class="quiz-complete">Congratulations! You\'ve completed the quiz!</p>';
                }
            } else {
                quiz.showAnswer(feedbackContainer);
                // Add retry button alongside next button
                feedbackContainer.innerHTML += `
                    <button onclick="setupQuestion()" class="retry-button">Try Again</button>
                `;
                if (quiz.moveToNextQuestion()) {
                    nextButton.classList.remove('hidden');
                }
            }
        };
    }
    
    nextButton.onclick = setupQuestion;
    setupQuestion(); // Show first question
}

window.startQuiz = startQuiz;
window.onload = loadQuizList;
