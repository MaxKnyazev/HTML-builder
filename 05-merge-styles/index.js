const path = require('path');
const { readdir, rm, appendFile, readFile } = require('fs/promises');

const pathToStylesFolder = path.join(__dirname, 'styles');
const pathToBundleFile = path.join(__dirname, 'project-dist', 'bundle.css');

const buildBundle = async () => {
  try {
    await rm(pathToBundleFile, {force: true});
    const files = await readdir(pathToStylesFolder, {encoding: 'utf8', withFileTypes: true});
    for (const file of files) {
      const pathToFile = path.join(pathToStylesFolder, file.name);
      const fileExt = path.parse(pathToFile).ext.slice(1);
      if (file.isFile() && fileExt === 'css') {
        await appendFile(pathToBundleFile, await readFile(pathToFile));
      }
    }
  } catch (err) {
    console.error(err);
  }
};

buildBundle().catch(err => console.error(err));