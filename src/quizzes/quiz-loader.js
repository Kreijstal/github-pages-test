import { marked } from 'https://esm.sh/marked@11.2.0';
import { generateTomlSnippet, setupCommentForm } from '../comment-utils.js';
import TOML from 'https://esm.sh/@iarna/toml@2.2.5';

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
            
            <div class="comment-form">
                <h3>Create Your Comment</h3>
                <form id="comment-form">
                    <div class="form-group">
                        <label for="author">Author Name:</label>
                        <input type="text" id="author" required>
                    </div>
                    <div class="form-group">
                        <label for="avatar">Avatar URL (optional):</label>
                        <input type="url" id="avatar" placeholder="https://your-avatar-url.com/image.jpg">
                    </div>
                    <div class="form-group">
                        <label for="comment-text">Comment (Markdown supported):</label>
                        <textarea id="comment-text" rows="6" required></textarea>
                    </div>
                    <div class="form-buttons">
                        <button type="button" id="preview-btn">Preview</button>
                        <button type="button" id="generate-btn">Post</button>
                    </div>
                </form>
            </div>

            <div id="preview-container" class="hidden">
                <h3>Preview</h3>
                <div id="comment-preview"></div>
            </div>

            <div class="contribute-info hidden">
                <p>Want to add your own comment? You can contribute by:</p>
                <ol>
                    <li>Editing the comments.toml file for this quiz</li>
                    <li>Adding your comment using TOML format with markdown support</li>
                    <li>Creating a pull request</li>
                </ol>
                <pre id="toml-output"></pre>
            </div>

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
    
    // Load comments for this quiz and setup comment form
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
