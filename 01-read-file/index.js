const path = require('path');
const fs = require('fs');

try {
  const pathToFile = path.join(__dirname, 'text.txt');
  const fsReadStream = fs.createReadStream(pathToFile, 'utf8');
  fsReadStream.on('data', (chunk) => {
    console.log(chunk);
  });
} catch(err) {
  console.log(err);
}
