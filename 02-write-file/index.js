const path = require('path');
const fs = require('fs');
const process = require('process');
const { exit } = require('process');

const pathToFile = path.join(__dirname, 'text.txt');
const fsWriteStream = fs.createWriteStream(pathToFile, 'utf8');

console.log('Здравствуйте! Для начала работы введите текст в консоль');
console.log('Для окончания введите команду \'exit\' или нажмите сочетание клавиш ctrl + c');

process.stdin.resume();
process.stdin.on('data', chunk => {
  if (chunk.toString().trim().toLowerCase() === 'exit') {
    console.log('Работа завершена.');
    exit();
  }
  fsWriteStream.write(`${chunk}`);
});

process.on('SIGINT', () => {
  console.log('Работа завершена.');
  exit();
});
