import fs from 'fs';
import path from 'path';

const projectRoot = '/home/stella_karolina/Documentos/vinculo/origin/vinculotea-2.0';
const targetDirs = ['src', 'public', 'styles', 'docs', 'scripts'];
const targetExtensions = ['.ts', '.tsx', '.js', '.jsx', '.css', '.html', '.md', '.mdx'];

function walk(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            if (!f.startsWith('.') && f !== 'node_modules') {
                walk(dirPath, callback);
            }
        } else {
            callback(dirPath);
        }
    });
}

targetDirs.forEach(dir => {
    walk(path.join(projectRoot, dir), (filePath) => {
        const ext = path.extname(filePath);
        if (targetExtensions.includes(ext)) {
            let content = fs.readFileSync(filePath, 'utf8');






            content = content.replace(/^[ \t]*\/\/(?![\/!]).*$/gm, '');




            content = content.replace(/([ \t]+)\/\/(?![\/!]).*$/gm, '$1');

            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Comments removed: ${filePath}`);
        }
    });
});

console.log('Finalizado: Todos os comentários 
