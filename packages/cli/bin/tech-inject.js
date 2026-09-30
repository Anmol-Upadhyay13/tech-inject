#!/usr/bin/env node

import { runInstaller } from '../src/installer.ts';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    console.log(`
Tech Inject CLI - Official Component Installer

Usage:
  npx @tech-inject/cli add <component> [options]

Commands:
  add <component>     Install a component and its supporting tokens into your project

Options:
  --dir <path>        Target installation directory (default: ./src/components/ui)
  --token <token>     Premium access token for authorized components
  --api <url>         Custom registry endpoint (default: http://localhost:3000)
  --overwrite         Allow overwriting existing files
  -h, --help          Show help information

Examples:
  npx @tech-inject/cli add button
  npx @tech-inject/cli add table --token your_premium_token
  npx @tech-inject/cli add input --dir ./components
    `);
    process.exit(0);
  }

  if (command !== 'add') {
    console.error(`Unknown command: "${command}". Did you mean "add"?`);
    process.exit(1);
  }

  const component = args[1];
  if (!component) {
    console.error('Error: Component name is required. Example: npx @tech-inject/cli add button');
    process.exit(1);
  }

  let targetDir = './src/components/ui';
  let token = undefined;
  let apiUrl = undefined;
  let overwrite = false;

  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--dir' && args[i + 1]) {
      targetDir = args[++i];
    } else if (args[i] === '--token' && args[i + 1]) {
      token = args[++i];
    } else if (args[i] === '--api' && args[i + 1]) {
      apiUrl = args[++i];
    } else if (args[i] === '--overwrite') {
      overwrite = true;
    }
  }

  console.log(`\n⏳ Fetching "${component}" from Tech Inject Component Registry...`);

  const result = await runInstaller({
    component,
    targetDir,
    token,
    apiUrl,
    overwrite,
  });

  if (result.success) {
    console.log(`\n${result.message}`);
    console.log('\nInstalled files:');
    result.installedFiles.forEach((f) => console.log(`  - ${f}`));
    console.log('\n✔ Ready to import into your React project!\n');
    process.exit(0);
  } else {
    console.error(`\n✖ Installation failed: ${result.message}\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Unexpected CLI error:', err);
  process.exit(1);
});
