const path = require('path');
const { readdir, mkdir, copyFile, rm, readFile, appendFile } = require('fs/promises');

const createDirectory = async (pathToDir) => {
  await rm(pathToDir, {force: true, recursive: true});
  await mkdir(pathToDir);
};

const recursiveCopyDirectory = async (from, to) => {
  await rm(to, {force: true, recursive: true});
  await mkdir(to);

  const files = await readdir(from, {encoding: 'utf8', withFileTypes: true});
  for (const file of files) {
    const pathToFile = path.join(from, file.name);
    const pathToCopyFile = path.join(to, file.name);

    if (file.isFile()) {
      await copyFile(pathToFile, pathToCopyFile);
    } else {
      await recursiveCopyDirectory(pathToFile, pathToCopyFile);
    }
  }
};

const mergeStyles = async (pathToBundleFile, pathToStylesFolder) => {
  await rm(pathToBundleFile, {force: true});
  const files = await readdir(pathToStylesFolder, {encoding: 'utf8', withFileTypes: true});
  for (const file of files) {
    const pathToFile = path.join(pathToStylesFolder, file.name);
    const fileExt = path.parse(pathToFile).ext.slice(1);
    if (file.isFile() && fileExt === 'css') {
      await appendFile(pathToBundleFile, await readFile(pathToFile));
    }
  }
};

const buildHTML = async (pathToTemplate, pathToComponents, pathToIndex) => {
  await rm(pathToIndex, {force: true});
  await appendFile(pathToIndex, '');
  const components = await readdir(pathToComponents, {encoding: 'utf8', withFileTypes: true});

  let templateArr = (await readFile(pathToTemplate, 'utf8'))
    .split('{{')
    .map(elem => elem.split('}}'))
    .flat()
    .map(elem => `\n${elem.trim()}\n`);

  for (let i = 0; i < templateArr.length; i++) {
    for (const component of components) {
      const pathToComponent = path.join(pathToComponents, component.name);
      const componentName = path.parse(pathToComponent).name;
      const componentExt = path.parse(pathToComponent).ext.slice(1);

      if ((templateArr[i].trim() === componentName) && (componentExt === 'html')) {
        templateArr[i] = await readFile(pathToComponent, 'utf8');
      }
    }
  }
  await appendFile(pathToIndex, templateArr.join(''));
};

const buildPage = async () => {
  const pathToProjectDist = path.join(__dirname, 'project-dist');
  const pathToAssets = path.join(__dirname, 'assets');
  const pathToProjectDistAssets = path.join(pathToProjectDist, 'assets');
  const pathToBundleCSS = path.join(__dirname, 'project-dist', 'style.css');
  const pathToStylesFolder = path.join(__dirname, 'styles');
  const pathToTemplate = path.join(__dirname, 'template.html');
  const pathToComponents = path.join(__dirname, 'components');
  const pathToIndex = path.join(pathToProjectDist, 'index.html');

  await createDirectory(pathToProjectDist);
  await recursiveCopyDirectory(pathToAssets, pathToProjectDistAssets);
  await mergeStyles(pathToBundleCSS, pathToStylesFolder);
  await buildHTML(pathToTemplate, pathToComponents, pathToIndex);
};

buildPage()
  .then(() => console.log('Task complete successfully'))
  .catch(err => console.log(err));
