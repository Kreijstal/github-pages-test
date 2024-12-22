const fs = require('fs');
const JSZip = require('jszip');

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
  
  const content = await zip.generateAsync({type: "nodebuffer"});
  fs.writeFileSync('data.zip', content);
}

createZip();
