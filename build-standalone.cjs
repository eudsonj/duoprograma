const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  console.log("=== STARTING STANDALONE SINGLE-FILE COMPILATION ===");

  // 1. Compile JS with esbuild to an IIFE bundle
  console.log("Step 1: Compiling application with esbuild...");
  execSync('npx esbuild src/main.tsx --bundle --minify --format=iife --outfile=dist/test-bundle.js --loader:.css=empty', { stdio: 'inherit' });

  // 2. Read the bundled JS
  console.log("Step 2: Reading bundled JS...");
  const jsContent = fs.readFileSync('dist/test-bundle.js', 'utf8');

  // 3. Find and read the Vite compiled CSS
  console.log("Step 3: Finding compiled CSS in dist/assets...");
  const assetsDir = path.join(__dirname, 'dist', 'assets');
  const files = fs.readdirSync(assetsDir);
  const cssFile = files.find(file => file.endsWith('.css'));
  if (!cssFile) {
    throw new Error("Could not find compiled CSS file in dist/assets. Did you run 'npx vite build' first?");
  }
  const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');

  // 4. Create the final standalone HTML content
  console.log("Step 4: Writing standalone HTML content...");
  const htmlContent = `<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DevLingo - Gamified Code Learning</title>
    <!-- Tailwind CSS v4 inlined styles -->
    <style>
      ${cssContent}
    </style>
  </head>
  <body class="bg-[#050614] text-slate-100">
    <div id="root"></div>
    <!-- Self-contained IIFE Application Bundle -->
    <script>
      ${jsContent}
    </script>
  </body>
</html>`;

  // 5. Write to standalone.html and dist/index.html
  fs.writeFileSync('standalone.html', htmlContent);
  fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), htmlContent);
  console.log("Step 5: Successfully generated standalone.html and dist/index.html!");
  console.log("=== COMPILATION COMPLETED SUCCESSFULLY ===");
} catch (error) {
  console.error("Compilation failed:", error);
  process.exit(1);
}
