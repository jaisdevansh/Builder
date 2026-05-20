const validIcons = ['ArrowRight', 'Github', 'Twitter', 'Linkedin', 'Instagram', 'Mail', 'Phone', 'Menu', 'X', 'ChevronRight', 'Star', 'Heart', 'Check', 'Play', 'User'];

function sanitizeAndFixIcons(code) {
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"];?/g;
  let match;
  let iconsToReplace = [];
  
  // 1. Extract all currently imported icons to find hallucinated ones
  importRegex.lastIndex = 0;
  while ((match = importRegex.exec(code)) !== null) {
    const importedIcons = match[1].split(/[\s,]+/).map(i => i.trim()).filter(Boolean);
    importedIcons.forEach(icon => {
      if (!validIcons.includes(icon) && !iconsToReplace.includes(icon)) {
        iconsToReplace.push(icon);
      }
    });
  }
  
  // 2. Replace hallucinated icons with Star in the file
  iconsToReplace.forEach(icon => {
    const regex = new RegExp(`\\b${icon}\\b`, 'g');
    code = code.replace(regex, 'Star');
  });
  
  // 3. Scan the code body (excluding imports) for any used valid icons
  const codeWithoutImports = code.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '');
  const usedValidIcons = [];
  validIcons.forEach(icon => {
    const jsxRegex = new RegExp(`<${icon}\\b`, 'g');
    if (jsxRegex.test(codeWithoutImports)) {
      usedValidIcons.push(icon);
    }
  });

  // 4. Clean up, merge, and deduplicate import statements
  importRegex.lastIndex = 0;
  if (importRegex.test(code)) {
    importRegex.lastIndex = 0;
    code = code.replace(importRegex, (match, p1) => {
      const imported = p1.split(/[\s,]+/).map(i => i.trim()).filter(Boolean);
      // Map replaced/hallucinated icons to Star
      const sanitizedImported = imported.map(icon => validIcons.includes(icon) ? icon : 'Star');
      // Merge with used valid icons
      const allIcons = [...new Set([...sanitizedImported, ...usedValidIcons])];
      return `import { ${allIcons.join(', ')} } from 'lucide-react';`;
    });
  } else if (usedValidIcons.length > 0) {
    // If no import statement exists but icons are used, insert one at the top
    code = `import { ${[...new Set(usedValidIcons)].join(', ')} } from 'lucide-react';\n` + code;
  }

  return code;
}

// Test case for missing imports (FooterSection.tsx scenario)
const testFooter = `
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FooterSection() {
  return (
    <footer>
      <Github className="mr-2" /> GitHub
      <Twitter className="mr-2" /> Twitter
      <Linkedin className="mr-2" /> LinkedIn
      <Instagram className="mr-2" /> Instagram
      <Mail className="mr-2" /> Email
      <Phone className="mr-2" /> Phone
      <ArrowRight className="mr-2" /> Learn More
    </footer>
  );
}
`;

console.log("SANITISED FOOTER:");
console.log(sanitizeAndFixIcons(testFooter));

// Test case for hallucinated icon + missing import + duplication
const testHallucinated = `
import { Github, Shield } from 'lucide-react';

export default function Test() {
  return (
    <div>
      <Github />
      <Shield />
      <Mail />
    </div>
  );
}
`;

console.log("\nSANITISED HALLUCINATED:");
console.log(sanitizeAndFixIcons(testHallucinated));
