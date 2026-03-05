const fs = require('fs');
const TurndownService = require('turndown');
const path = require('path');

const turndownService = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced'
});

const filesToConvert = [
    { in: 'dai_ton.html', out: 'dai_ton.md' },
    { in: 'si_tuyen.html', out: 'si_tuyen.md' },
    { in: 'si_khai.html', out: 'si_khai.md' }
];

for (const file of filesToConvert) {
    try {
        if (fs.existsSync(file.in)) {
            const html = fs.readFileSync(file.in, 'utf8');
            const md = turndownService.turndown(html);
            fs.writeFileSync(file.out, md, 'utf8');
            console.log(`Converted ${file.in} to ${file.out}`);
        } else {
            console.warn(`File not found: ${file.in}`);
        }
    } catch (error) {
        console.error(`Error converting ${file.in}:`, error);
    }
}
