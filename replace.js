const fs = require('fs');
const path = require('path');

const dir = '/home/dustin/Projects/CommandCenter';

function replaceInFile(filePath, searchRegex, replacement) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content.replace(searchRegex, replacement);
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            console.log(`Updated ${filePath}`);
        }
    }
}

function globalReplace(searchStr, replacement) {
    const files = ['index.html', 'script.js', 'style.css', 'manifest.json', 'README.md', 'offline.html', 'importExport.js'];
    files.forEach(f => {
        replaceInFile(path.join(dir, f), new RegExp(searchStr, 'g'), replacement);
    });
}

// 1. PromptForge -> CommandCenter
globalReplace('PromptForge', 'CommandCenter');
globalReplace('promptForge', 'commandCenter');

// 2. hammer icon to terminal
replaceInFile(path.join(dir, 'index.html'), /fa-hammer/g, 'fa-terminal');

// 3. AI Prompts -> Commands
replaceInFile(path.join(dir, 'script.js'), /You are an expert prompt engineer.*?Return only the improved prompt text\./g, 'You are an expert Linux sysadmin. Suggest or fix the command described by the user to achieve their goal. Return only the command text, without markdown formatting or code blocks.');

// Update UI text in script.js
replaceInFile(path.join(dir, 'script.js'), /<i class="fas fa-spinner fa-spin"><\/i> Enhancing\.\.\./g, '<i class="fas fa-spinner fa-spin"></i> Processing...');
replaceInFile(path.join(dir, 'script.js'), /<i class="fas fa-magic"><\/i> Enhance with AI/g, '<i class="fas fa-magic"></i> Suggest/Fix Command');
replaceInFile(path.join(dir, 'script.js'), /Prompt enhanced successfully!/g, 'Command processed successfully!');
replaceInFile(path.join(dir, 'script.js'), /No prompt content to enhance/g, 'No command content to suggest/fix');
replaceInFile(path.join(dir, 'script.js'), /Enhancing\.\.\./g, 'Processing...');
replaceInFile(path.join(dir, 'script.js'), /Enhance prompt/gi, 'Suggest/Fix command');

// Update UI text in index.html
replaceInFile(path.join(dir, 'index.html'), /AI Prompt Lab/g, 'AI Command Lab');
replaceInFile(path.join(dir, 'index.html'), /AI Prompt Management System/g, 'AI Command Management System');
replaceInFile(path.join(dir, 'index.html'), /Describe the prompt you want to create or enhance/g, 'Describe the command you want to create or fix');

console.log('Done.');
