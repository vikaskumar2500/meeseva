import { spawn, spawnSync } from 'node:child_process';
import process from 'node:process';

console.log('\x1b[36m%s\x1b[0m', '════════════════════════════════════════════════════════════════');
console.log('\x1b[32m%s\x1b[0m', '  🚀 Starting MeeSeva Monorepo Workspace (Dev Mode)');
console.log('\x1b[36m%s\x1b[0m', '════════════════════════════════════════════════════════════════');

// Ensure shared package is compiled before launching dev services
console.log('\x1b[33m%s\x1b[0m', '📦 Building @meeseva/shared package...');
spawnSync('pnpm', ['--filter', '@meeseva/shared', 'build'], {
  stdio: 'inherit',
  shell: true,
});

console.log('\x1b[32m%s\x1b[0m', '🌟 Starting backend and frontend in parallel...');

const backend = spawn('pnpm', ['--filter', '@meeseva/backend', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env },
});

const frontend = spawn('pnpm', ['--filter', '@meeseva/frontend', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env },
});

const cleanup = () => {
  console.log('\nShutting down MeeSeva processes...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

backend.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Backend process exited with code ${code}`);
  }
});

frontend.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Frontend process exited with code ${code}`);
  }
});
