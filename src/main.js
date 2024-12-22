async function loadData() {
    try {
        // Get latest release
        const response = await fetch('https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/releases/latest');
        const release = await response.json();
        
        // Get zip file URL
        const zipUrl = release.assets.find(asset => asset.name === 'data.zip').browser_download_url;
        
        // Download and process zip
        const zipResponse = await fetch(zipUrl);
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
