async function fetchWithFallback(url) {
    const corsProxies = [
        'https://api.cors.lol/?url=',
        'https://bands-proxy.cloudandsoda.workers.dev/corsproxy/?apiurl='
    ];
    
    // Shuffle the array of proxies
    const shuffledProxies = [...corsProxies].sort(() => Math.random() - 0.5);
    
    let lastError;
    for (const proxy of shuffledProxies) {
        try {
            const response = await fetch(proxy + encodeURIComponent(url));
            if (response.ok) {
                return response;
            }
        } catch (error) {
            lastError = error;
            console.warn(`Proxy ${proxy} failed:`, error);
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
