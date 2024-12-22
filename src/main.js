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
    throw new Error(`All proxies failed. Last error: ${lastError}`);
}

async function loadData() {
    try {
        const baseUrl = 'https://github.com/Kreijstal/github-pages-test/releases/download/latest-data/data.zip';
        
        // Try fetching with fallback proxies
        const zipResponse = await fetchWithFallback(baseUrl);
        const zipBlob = await zipResponse.blob();
        
        const zip = new JSZip();
        const contents = await zip.loadAsync(zipBlob);
        const dataText = await contents.file("data.json").async("text");
        const data = JSON.parse(dataText);
        
        // Display data
        const container = document.getElementById('data-container');
        container.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

window.onload = loadData;
