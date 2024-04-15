/* eslint-disable */
const fs = require('fs');

const data = fs.readdirSync('./src/res');

const images = data.filter(file => /\.png$/.test(file));
const previous = images.map(file => file.replace(/(@\dx)?\.png/, ''));
const uniq = [...new Set(previous)];
const imp = uniq.reduce((pre, cur) => {
  const item = `const ${cur} = require('./${cur}.png');\n`;
  return pre + item;
}, '');

// 添加gif格式
const gif = data.filter(file => /\.gif$/.test(file));
const gifPrevious = gif.map(file => file.replace(/(@\dx)?\.gif/, ''));
const gifMap = gifPrevious.reduce((pre, cur) => {
  const item = `const ${cur} = require('./${cur}.gif');\n`;
  return pre + item;
}, '');

// const exp = uniq.reduce((pre, cur) => {
//     const item = `const ${cur} = require('./${cur}.png')\n`;
//     return pre + item;
//   }, '');

const exp = `\nexport default { ${[...uniq, ...gifPrevious].join(', ')} };`;

console.log(previous);
console.log(imp, exp);

fs.writeFileSync('./src/res/index.ts', imp + gifMap + exp);
