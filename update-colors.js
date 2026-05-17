const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src/components');
let totalReplacements = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content;

    // Replace text-gray-300, text-gray-500, text-zinc-300, text-zinc-500, text-neutral-300, text-neutral-500, text-slate-300, text-slate-500 with text-muted-foreground
    newContent = newContent.replace(/text-(gray|zinc|slate|neutral)-(300|500)/g, 'text-muted-foreground');
    
    // Replace bg-white/X with bg-foreground/X
    newContent = newContent.replace(/bg-white\/(\d+|\[.*?\])/g, 'bg-foreground/$1');

    // Replace border-white/X with border-foreground/X
    newContent = newContent.replace(/border-white\/(\d+|\[.*?\])/g, 'border-foreground/$1');

    // Replace text-white/X with text-foreground/X
    newContent = newContent.replace(/text-white\/(\d+|\[.*?\])/g, 'text-foreground/$1');
    
    // Handle specific text-white that is NOT inside colorful backgrounds.
    // As a heuristic, we can replace "text-white" with "dark:text-white text-black" in general text.
    // Let's manually replace specific components instead of a blanket regex for text-white.

    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        totalReplacements++;
        console.log('Updated', file);
    }
});
console.log('Total files updated:', totalReplacements);
