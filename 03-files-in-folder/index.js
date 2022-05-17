const path = require('path');
const { readdir } = require('fs/promises');
const { stat } = require('fs');

const pathToFolder = path.join(__dirname, 'secret-folder');
const getFiles = async path => await readdir(path, {encoding: 'utf8', withFileTypes: true});
getFiles(pathToFolder)
  .then(files => {
    for (const file of files) {
      if (file.isFile()) {
        const pathToFile = path.join(pathToFolder, file.name);
        stat(pathToFile, (err, stats) => {
          if (err) throw err;
          const fileName = path.parse(pathToFile).name;
          const fileExt = path.parse(pathToFile).ext.slice(1);
          const fileSize = stats.size;
          console.log(`${fileName} - ${fileExt} - ${fileSize}`);
        });
      }
    }
  })
  .catch(err => console.log(err));