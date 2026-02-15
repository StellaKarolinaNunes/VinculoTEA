import fs from 'fs';
import path from 'path';

const docsDir = '/home/stella_karolina/Documentos/vinculo/origin/vinculotea-2.0/docs';

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
};

walk(docsDir, (filePath) => {
    if (filePath.endsWith('.md') || filePath.endsWith('.mdx')) {
        let content = fs.readFileSync(filePath, 'utf8');


        const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
        content = content.replace(emojiRegex, '');



        content = content.replace(/^(?!\s*https:\/\/)\s*\/\/.*$/gm, '');

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Cleaned: ${filePath}`);
    }
});
