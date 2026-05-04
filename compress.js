const fs = require('fs');
let c = fs.readFileSync('repomix-output.xml', 'utf8');

const matches = c.match(/<file path="([^"]+)">([\s\S]*?)<\/file>/g) || [];

// فلتر - احذف الملفات الكبيرة غير الضرورية
const skip = ['node_modules', '.lock', 'package-lock', 'dist/', 'build/'];
let result = '';
let kept = 0;

matches.forEach(m => {
  const path = m.match(/path="([^"]+)"/)[1];
  if (skip.some(s => path.includes(s))) return;
  
  let content = m.replace(/<file path="[^"]+">/, '').replace(/<\/file>$/, '').trim();
  
  // ضغط قوي
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  content = content.replace(/^\s*\/\/.*/gm, '');
  content = content.replace(/^\s*#.*/gm, '');
  content = content.replace(/\n{2,}/g, '\n');
  content = content.replace(/[ \t]+/g, ' ');
  content = content.replace(/^ +/gm, '');
  
  result += '//FILE:' + path + '\n' + content + '\n';
  kept++;
});

fs.writeFileSync('repo_ultra.txt', result);
console.log('النتيجة: ' + (result.length/1024).toFixed(1) + ' KB');
console.log('الملفات: ' + kept + ' من ' + matches.length);