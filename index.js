import { getState } from './db/state.js';
import checkBatt from './src/checkBatt.js';
import timestamp from './src/utils.js';

// Driver that prevents cron from
// running another process of
// this program. Only invoke
// checkBatt when state is inactive.

// (Cron outputs to log/jobs.log.)

(async () => {
  console.log(`${timestamp()} Battery checker job starting...`);
  const programState = await getState();
  if (programState === 'active') {
    console.log('...Already active. Proceeding to exit.');
    return;
  }
  checkBatt(0);
})();
