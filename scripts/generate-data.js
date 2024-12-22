const fs = require('fs');
const JSZip = require('jszip');
const TOML = require('@iarna/toml');
const { marked } = require('marked');

// Generate some sample data
const generateData = () => {
  const data = [];
  for (let i = 0; i < 1000; i++) {
    data.push({
      id: i,
      value: Math.random(),
      text: `Sample text ${i}`
    });
  }
  return data;
};

// Create and save zip file
async function createZip() {
  const zip = new JSZip();
  const data = generateData();
  
  zip.file("data.json", JSON.stringify(data));
  
  // Read and process comments from TOML
  const commentsToml = fs.readFileSync('comments.toml', 'utf-8');
  const commentsData = TOML.parse(commentsToml);
  
  // Convert markdown to HTML in comments
  const processedComments = {
    comments: commentsData.comments.map(comment => ({
      author: comment.author,
      text: marked(comment.text, { breaks: true })
    }))
  };
  
  zip.file("comments.json", JSON.stringify(processedComments));
  
  const content = await zip.generateAsync({type: "nodebuffer"});
  fs.writeFileSync('data.zip', content);
}

createZip();
