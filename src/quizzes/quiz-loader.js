import { marked } from 'https://esm.sh/marked@11.2.0';
import TOML from 'https://esm.sh/@iarna/toml@7.2.0';

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

async function loadQuizComments(quizId) {
    try {
        const response = await fetch(`${quizId}/comments.toml`);
        const tomlText = await response.text();
        const commentsData = TOML.parse(tomlText);
        
        const commentsSection = document.getElementById('comments-section');
        commentsSection.innerHTML = `
            <h2>How was this quiz?</h2>
            <p>Let us know your thoughts in the comments below!</p>
            <div id="comments-container">
                ${commentsData.comments.map(comment => `
                    <div class="comment">
                        <div class="comment-header">
                            <img class="comment-avatar" src="${comment.avatar || 'https://secure.gravatar.com/avatar/default?s=164&d=identicon'}" alt="${comment.author}'s avatar">
                            <strong class="comment-author">${comment.author}</strong>
                        </div>
                        <div class="comment-content">
                            <div class="comment-text">${marked.parse(comment.text, { breaks: true })}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

async function startQuiz(quizId) {
    const QuizClass = AVAILABLE_QUIZZES[quizId];
    if (!QuizClass) return;

    const quiz = new QuizClass();
    const container = document.getElementById('quiz-content');
    const feedbackContainer = document.getElementById('quiz-feedback');
    const nextButton = document.getElementById('next-question');
    
    document.getElementById('quiz-container').classList.remove('hidden');
    document.getElementById('comments-section').classList.remove('hidden');
    
    // Load comments for this quiz
    await loadQuizComments(quizId);
    
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
