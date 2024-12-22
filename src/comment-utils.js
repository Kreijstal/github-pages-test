import { marked } from 'https://esm.sh/marked@11.2.0';
import TOML from 'https://esm.sh/@iarna/toml@2.2.5';

export function generateTomlSnippet(author, avatar, text) {
    return `[[comments]]
author = "${author}"
${avatar ? `avatar = "${avatar}"` : '# avatar = "https://your-avatar-url.com/image.jpg"'}
text = """
${text}
"""`;
}

export function getCommentsTemplate() {
    return `
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

            <div id="comments-container"></div>
    `;
}

export async function loadQuizComments(quizId) {
    try {
        const response = await fetch(`${quizId}/comments.toml`);
        const tomlText = await response.text();
        const commentsData = TOML.parse(tomlText);
        
        const commentsSection = document.getElementById('comments-section');
        commentsSection.innerHTML = getCommentsTemplate();
        
        const commentsContainer = document.getElementById('comments-container');
        commentsContainer.innerHTML = commentsData.comments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <img class="comment-avatar" src="${comment.avatar || 'https://secure.gravatar.com/avatar/default?s=164&d=identicon'}" alt="${comment.author}'s avatar">
                    <strong class="comment-author">${comment.author}</strong>
                </div>
                <div class="comment-content">
                    <div class="comment-text">${marked.parse(comment.text, { breaks: true })}</div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

export function previewComment(author, avatar, text, marked) {
    const preview = document.getElementById('comment-preview');
    preview.innerHTML = `
        <div class="comment">
            <div class="comment-header">
                <img class="comment-avatar" src="${avatar || 'https://secure.gravatar.com/avatar/default?s=164&d=identicon'}" alt="${author}'s avatar">
                <strong class="comment-author">${author}</strong>
            </div>
            <div class="comment-content">
                <div class="comment-text">${marked.parse(text, { breaks: true })}</div>
            </div>
        </div>
    `;
}

export async function setupCommentForm(quizId) {
    const { marked } = await import('https://esm.sh/marked@11.2.0');
    const form = document.getElementById('comment-form');
    const previewBtn = document.getElementById('preview-btn');
    const generateBtn = document.getElementById('generate-btn');
    const previewContainer = document.getElementById('preview-container');
    const tomlOutput = document.getElementById('toml-output');

    previewBtn.addEventListener('click', () => {
        const author = document.getElementById('author').value;
        const avatar = document.getElementById('avatar').value;
        const text = document.getElementById('comment-text').value;

        if (author && text) {
            previewComment(author, avatar, text, marked);
            previewContainer.classList.remove('hidden');
            tomlOutput.classList.add('hidden');
        }
    });

    generateBtn.addEventListener('click', () => {
        const author = document.getElementById('author').value;
        const avatar = document.getElementById('avatar').value;
        const text = document.getElementById('comment-text').value;

        if (author && text) {
            const toml = generateTomlSnippet(author, avatar, text);
            tomlOutput.textContent = toml;
            document.querySelector('.contribute-info').classList.remove('hidden');
            tomlOutput.parentElement.classList.remove('hidden');
            tomlOutput.classList.remove('hidden');
            previewContainer.classList.add('hidden');
            
            // Update the edit link to point to the correct comments.toml file
            const editLink = document.querySelector('.contribute-info a');
            if (editLink) {
                editLink.href = `https://github.com/Kreijstal/github-pages-test/edit/master/src/quizzes/${quizId}/comments.toml`;
            }
        }
    });
}
