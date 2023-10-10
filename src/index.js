import { getState } from '../db/state.js';
import checkBatt from './checkBatt.js';
import timestamp from './utils.js';

// Driver code. First checks to see
// if program is already running,
// which could happen when an active
// alert state hasn't yet been dealt
// with (i.e. charger is unplugged or
// plugged in depending on which).

// Crontab outputs to log/jobs.log.

(async () => {
  console.log(`\n\n${timestamp()} Battery checker job starting...`);
  const programState = await getState();
  if (programState === 'active') {
    console.log('...Already active. Exiting.');
    return;
  }
  checkBatt(0);
})();
