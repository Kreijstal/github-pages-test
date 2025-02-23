async function fetchWithFallback(url) {
    const proxyHandlers = [
        // Simple URL encoding proxy
        async (url) => {
            return fetch(`https://api.cors.lol/?url=${encodeURIComponent(url)}`);
        },
        // Another URL encoding proxy
        async (url) => {
            return fetch(`https://bands-proxy.cloudandsoda.workers.dev/corsproxy/?apiurl=${encodeURIComponent(url)}`);
        },
        // Proxy requiring custom headers
        async (url) => {
            return fetch(`https://cors-proxy.fringe.zone/${url}`, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            });
        },
        // AllOrigins proxy
        async (url) => {
            return fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
        },
        // WhateverOrigin proxy (returns JSON with contents property)
        async (url) => {
            const response = await fetch(`https://www.whateverorigin.org/get?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            // Create a new response with the contents
            return new Response(data.contents, {
                status: 200,
                headers: new Headers({
                    'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream'
                })
            });
        },
        // CrossOrigin.me proxy
        async (url) => {
            return fetch(`https://crossorigin.me/${url}`);
        }
    ];
    
    // Shuffle the handlers
    const shuffledHandlers = [...proxyHandlers].sort(() => Math.random() - 0.5);
    
    let lastError;
    for (const handler of shuffledHandlers) {
        try {
            const response = await handler(url);
            if (response.ok) {
                return response;
            }
        } catch (error) {
            lastError = error;
            console.warn('Proxy handler failed:', error);
            continue;
        }
    }
    const errorMsg = `All proxies failed. Last error: ${lastError}\n\n` +
        'If you continue having CORS issues, try installing the CORS Unblock addon:\n' +
        'https://addons.mozilla.org/en-US/firefox/addon/cors-unblock/';
    throw new Error(errorMsg);
}

async function loadData() {
    try {
        const baseUrl = 'https://github.com/Kreijstal/github-pages-test/releases/download/latest-data/data.zip';
        
        let zipResponse;
        
        // First try direct fetch without any proxy
        try {
            zipResponse = await fetch(baseUrl);
            if (!zipResponse.ok) {
                throw new Error(`Direct fetch failed with status: ${zipResponse.status}`);
            }
        } catch (error) {
            console.warn('Direct fetch failed, trying proxies:', error);
            // If direct fetch fails, try fetching with fallback proxies
            zipResponse = await fetchWithFallback(baseUrl);
        }
        
        const zipBlob = await zipResponse.blob();
        
        const zip = new JSZip();
        const contents = await zip.loadAsync(zipBlob);
        const dataText = await contents.file("data.json").async("text");
        const commentsText = await contents.file("comments.json").async("text");
        const data = JSON.parse(dataText);
        const comments = JSON.parse(commentsText);
        
        // Display data
        const container = document.getElementById('data-container');
        container.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        
        // Display comments
        const commentsContainer = document.getElementById('comments-container');
        commentsContainer.innerHTML = comments.comments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <img class="comment-avatar" src="${comment.avatar}" alt="${comment.author}'s avatar">
                    <strong class="comment-author">${comment.author}</strong>
                </div>
                <div class="comment-content">
                    <div class="comment-text">${comment.text}</div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function generateTomlSnippet(author, avatar, text) {
    return `[[comments]]
author = "${author}"
${avatar ? `avatar = "${avatar}"` : '# avatar = "https://your-avatar-url.com/image.jpg"'}
text = """
${text}
"""`;
}

async function previewComment(author, avatar, text, marked) {
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

async function setupCommentForm() {
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

    // Handle post button click
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
        }
    });
}

window.onload = async () => {
    loadData();
    await setupCommentForm();
};
