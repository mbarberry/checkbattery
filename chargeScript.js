import { spawn } from 'node:child_process';

import timestamp from './date.js';
import checkBatt from './checkBatt.js';

// Driver code that checks to see
// if job is already running and
// proceeds with main battery
// function if not. Crontab
// redirects all stdout and
// stderr to one log file.

const fileName = () => {
  const filePath = process.argv[1];
  let idx = filePath.length - 1;
  let fileName = [];
  while (idx >= 0 && filePath[idx] !== '/') {
    fileName.push(filePath[idx]);
    idx--;
  }
  return fileName.reverse().join('');
};

(function main() {
  console.log(`${timestamp()} Battery checker job starting...`);
  // Equal to ps aux | grep <file> in bash.
  const ps = spawn('ps', ['aux']);
  const grep = spawn('grep', [fileName()]);
  // Pipe ps output to grep input.
  ps.stdout.on('data', (data) => {
    grep.stdin.write(data);
  });
  // Parse grep output and decide
  // whether to continue.
  grep.stdout.on('data', (data) => {
    const processes = data.toString();
    // Remove last blank line.
    const lines = processes.split('\n').slice(0, -1);
    // Expected are (1) bash process spawned by
    // cron, (2) node process spawned by bash,
    // (3) grep process we are in right
    // now.
    if (lines.length > 3) {
      console.log('Already running. Exiting.\n');
      return;
    }
    // Proceed.
    checkBatt();
  });
  // Handle errors.
  ps.stderr.on('data', (err) => {
    console.log(`Error in ps process: ${err}`);
  });
  ps.on('close', (code) => {
    if (code !== 0) {
      console.log(`ps process exited with code ${code}`);
    }
    grep.stdin.end();
  });
  grep.stderr.on('data', (err) => {
    console.log(`Error in grep process: ${err}`);
  });
  grep.on('close', (code) => {
    if (code !== 0) {
      console.log(`grep process exited with code ${code}`);
    }
  });
})();
