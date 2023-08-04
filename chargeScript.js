import timestamp from './date.js';
import checkBatt from './checkBatt.js';
import { getState } from './db/db.js';

// Driver code that checks to see
// if job is already running and
// proceeds with main battery
// function if not. Crontab
// redirects all stdout and
// stderr to one log file.

(async function main() {
  console.log(`${timestamp()} Battery checker job starting...`);
  const programState = await getState();
  if (programState === 'active') {
    console.log('Program is already running. Exiting.');
    return;
  }
  checkBatt(0);
})();
