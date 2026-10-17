import { spawn } from 'node:child_process';
import process from 'node:process';

console.log('\x1b[36m%s\x1b[0m', '════════════════════════════════════════════════════════════════');
console.log('\x1b[32m%s\x1b[0m', '  🚀 Starting MeeSeva Lite Enterprise Workspace (Dev Mode)');
console.log('\x1b[36m%s\x1b[0m', '════════════════════════════════════════════════════════════════');

const backend = spawn('pnpm', ['--dir', 'Meeseva-lite-backend', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env },
});

const frontend = spawn('npm', ['--prefix', 'Meeseva-lite-frontend', 'run', 'dev'], {
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

