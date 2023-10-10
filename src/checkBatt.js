import { spawn } from 'node:child_process';
import { updateState, getState } from '../db/state.js';

const TAKE_OFF_LEVEL = Number(process.argv[2]);
const TAKE_OFF_MSG = process.argv[3];
const PUT_ON_LEVEL = Number(process.argv[4]);
const PUT_ON_MSG = process.argv[5];
const SHORT_DELAY = 1000 * 30; // 30 seconds.
const LONG_DELAY = 1000 * 60 * 10; // 10 minutes.

const alert = (message) => {
  spawn('say', [message]);
};

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const getChargeLevel = (str) => {
  const tail = str.slice(str.indexOf('\t'));
  let level = '';
  let idx = 0;
  while (idx < tail.length && tail[idx] !== '%') {
    level += tail[idx];
    idx++;
  }
  return Number(level);
};

const getChargingAndLevel = (data) => {
  const status = data.toString();
  const lines = status.split('\n');
  // Will be either Battery (not charging)
  // or AC (charging).
  const charging = lines[0].includes('AC');
  const chargeLevel = getChargeLevel(lines[1]);
  return { charging, chargeLevel };
};

async function checkBatt(count) {
  // Log iteration number.
  console.log(`Running count #${count}.`);

  // Increase duration between alerts
  // if 5 have already been played.
  const userIsAway = count >= 5;
  const interval = userIsAway ? LONG_DELAY : SHORT_DELAY;

  // Run pmset as a child process to
  // get battery information.
  const batt = spawn('pmset', ['-g', 'batt']);

  batt.stdout.on('data', async (data) => {
    // Parse child process output for
    // information.
    const { charging, chargeLevel } = getChargingAndLevel(data);

    // Log information.
    console.log(
      `Current charge stats: charging (${charging}), chargeLevel(${chargeLevel})`
    );

    // Assess if an alert condition is met.
    const takeOff = charging && chargeLevel >= TAKE_OFF_LEVEL;
    const putOn = !charging && chargeLevel <= PUT_ON_LEVEL;

    // Handle cases where an alert
    // condition is met.
    if (takeOff || putOn) {
      console.log(`Alert condition met. **${takeOff ? 'takeOff' : 'putOn'}**`);

      // (Running the first iteration.)
      // Update state to active.
      if (count === 0) {
        console.log('Entering active state.');
        await updateState('active');
      }

      // Handle saying the alerts.
      if (takeOff) {
        alert(TAKE_OFF_MSG);
      } else {
        alert(PUT_ON_MSG);
      }

      // Pause.
      await wait(interval);
      // Recurse to either keep alerting
      // or exit the program if the
      // laptop charging state has
      // changed to no longer meet an alert
      // condition.
      checkBatt(count + 1);
      // Handle case where no alert
      // condition is met.
    } else {
      console.log('Alert condition not met.');
      // Check program state.
      const isActive = (await getState()) === 'active';
      // If we were just running and were
      // active, update to inactive.
      if (isActive) {
        console.log('Updating state to inactive.');
        await updateState('inactive');
      }
    }
  });

  batt.stderr.on('data', (err) => {
    console.log(`Error running pmset -g batt:\n${err}`);
  });

  batt.on('close', (code) => {
    if (code !== 0) {
      console.log(`pmset -g batt process exited with non-zero code:\n${code}`);
    }
  });
}

export default checkBatt;
