const fs = require('fs');
const path = require('path');

const files = [
  path.resolve(__dirname, 'generate_api_pptx.cjs'),
  path.resolve(__dirname, 'generate_pptx.cjs')
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content
      .replaceAll("'Outfit'", "'Times New Roman'")
      .replaceAll('"Outfit"', '"Times New Roman"')
      .replaceAll("'Plus Jakarta Sans'", "'Times New Roman'")
      .replaceAll('"Plus Jakarta Sans"', '"Times New Roman"');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated fonts to Times New Roman in: ${file}`);
  }
});
