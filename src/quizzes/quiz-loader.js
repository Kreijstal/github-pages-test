import { generateTomlSnippet, setupCommentForm, loadComments, CommentPersonalizationAPI, setupCommentsToggle } from '../comment-utils.js';

// Global variable to store the current quiz's edit URL
let currentQuizEditUrl = '';

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
            <button onclick="startQuiz('${id}')" class="button">Start Quiz</button>
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
    
    // Reset quiz state
    feedbackContainer.innerHTML = '';
    feedbackContainer.classList.add('hidden');
    nextButton.classList.add('hidden');
    
    // Show quiz container and comments section
    document.getElementById('quiz-container').classList.remove('hidden');
    
    // Initialize comments section
    const commentsSection = document.getElementById('comments-section');
    commentsSection.classList.remove('hidden');
    
    // Set up the edit URL for comments
    const editUrl = `https://github.com/Kreijstal/github-pages-test/edit/master/src/quizzes/${quizId}/comments.toml`;
    currentQuizEditUrl = editUrl;
    
    // Load comments and setup form
    const quizPersonalization = new CommentPersonalizationAPI({
        headerText: "How was this quiz?",
        subheaderText: "Let us know your thoughts in the comments below!",
        formTitle: "Share Your Quiz Experience",
        previewTitle: "Preview Your Comment",
        contributionText: "Want to help improve this quiz? You can contribute by:",
        editUrl: editUrl
    });
    
    await loadComments(`${quizId}/comments.toml`, quizPersonalization, editUrl);
    await setupCommentForm(editUrl);
    setupCommentsToggle();
    
    // Initial quiz display
    quiz.display(container);
}

function setupQuizListToggle() {
    const toggleButton = document.getElementById('quiz-list-toggle');
    const quizList = document.getElementById('quiz-list');
    
    toggleButton.onclick = () => {
        const isHidden = quizList.classList.contains('hidden');
        quizList.classList.toggle('hidden');
        toggleButton.textContent = isHidden ? 'Hide Available Quizzes' : 'Show Available Quizzes';
    };
}

window.startQuiz = startQuiz;
window.onload = () => {
    loadQuizList();
    setupQuizListToggle();
};
