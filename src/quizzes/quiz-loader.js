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
    setupCommentsToggle();
    
    // Initial quiz display
    quiz.display(container);
}

window.startQuiz = startQuiz;
window.onload = loadQuizList;
