const path = require('path');
const { readdir, mkdir, copyFile, rm } = require('fs/promises');

const pathToFolder = path.join(__dirname, 'files');
const pathToCopyFolder = path.join(__dirname, 'files-copy');

(async () => {
  await rm(pathToCopyFolder, {force: true, recursive: true});
  await mkdir(pathToCopyFolder);
  const files = await readdir(pathToFolder, {encoding: 'utf8', withFileTypes: true});
  for (const file of files) {
    const pathToFile = path.join(pathToFolder, file.name);
    const pathToCopyFile = path.join(pathToCopyFolder, file.name);
    await copyFile(pathToFile, pathToCopyFile);
  }
})().catch(err => console.error(err));
