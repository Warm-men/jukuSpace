/* eslint-disable */
const fs = require('fs');
const path = require('path');

// 读取i18n文件夹下的strings.ts文件内容
const strings = fs.readFileSync('./src/i18n/strings.ts', 'utf8');
const stringData = strings.replace('export default ', '');
const json = stringData.replace(';', '');
const obj = eval(`(${json})`);

// 将json对象生成strings.json文件
fs.writeFileSync('./src/i18n/strings.json', JSON.stringify(obj, null, 2));
