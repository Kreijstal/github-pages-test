async function loadData() {
    try {
        // Get data using CORS proxy
        const baseUrl = 'https://github.com/Kreijstal/github-pages-test/releases/download/latest-data/data.zip';
        const corsProxyUrl = 'https://api.cors.lol/?url=';
        const zipUrl = corsProxyUrl + encodeURIComponent(baseUrl);
        
        // Download and process zip
        const zipResponse = await fetch(zipUrl);
        if (!zipResponse.ok) {
            throw new Error(`HTTP error! status: ${zipResponse.status}`);
        }
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
