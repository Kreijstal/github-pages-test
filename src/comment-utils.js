export function generateTomlSnippet(author, avatar, text) {
    return `[[comments]]
author = "${author}"
${avatar ? `avatar = "${avatar}"` : '# avatar = "https://your-avatar-url.com/image.jpg"'}
text = """
${text}
"""`;
}

export async function previewComment(author, avatar, text, marked) {
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
