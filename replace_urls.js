const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      replaceInDir(filePath);
    } else if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      
      // Replace template literal usage: `http://localhost:5000...`
      content = content.replace(/`http:\/\/localhost:5000(.*?)`/g, '`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}$1`');
      
      // Replace double quotes usage: "http://localhost:5000..."
      content = content.replace(/"http:\/\/localhost:5000(.*?)"/g, '`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}$1`');
      
      // Replace single quotes usage: 'http://localhost:5000...'
      content = content.replace(/'http:\/\/localhost:5000(.*?)'/g, '`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}$1`');
      
      if (originalContent !== content) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath}`);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'frontend', 'src'));
