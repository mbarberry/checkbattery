import { spawn } from 'node:child_process';
import { updateState, getState } from '../db/state.js';

// TO DO: make this a class.
const TAKE_OFF_MSG = process.argv[2];
const PUT_ON_MSG = process.argv[3];
const SHORT_DELAY = 1000 * 30; // 30 seconds.
const LONG_DELAY = 1000 * 60 * 10; // 10 minutes.

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

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const alert = (message) => {
  spawn('say', [message]);
};

const getChargingAndLevel = (data) => {
  const status = data.toString();
  const lines = status.split('\n');
  // Will be either Battery or AC.
  const charging = lines[0].includes('AC');
  const chargeLevel = getChargeLevel(lines[1]);
  return { charging, chargeLevel };
};

async function checkBatt(count) {
  console.log(`Running count #${count}.`);

  // Adjust behavior if many alerts
  // have already been played.
  const userIsAway = count >= 5;
  const interval = userIsAway ? LONG_DELAY : SHORT_DELAY;

  // The actual shell command.
  const batt = spawn('pmset', ['-g', 'batt']);

  batt.stdout.on('data', async (data) => {
    const { charging, chargeLevel } = getChargingAndLevel(data);
    console.log(
      `Current charge stats: charging (${charging}), chargeLevel(${chargeLevel})`
    );
    const takeOff = charging && chargeLevel >= 80;
    const putOn = !charging && chargeLevel <= 20;
    // An alert condition is met.
    if (takeOff || putOn) {
      console.log(`Alert condition met. **${takeOff ? 'takeOff' : 'putOn'}**`);
      // Running for the first time.
      // Update state to active.
      if (count === 0) {
        console.log('Entering active state.');
        await updateState('active');
      }
      if (takeOff) {
        alert(TAKE_OFF_MSG);
      } else {
        alert(PUT_ON_MSG);
      }
      // Pause for timeout
      // and recurse.
      await wait(interval);
      checkBatt(count + 1);
    } else {
      // Condition not met.
      console.log('Alert condition not met.');
      const isActive = (await getState()) === 'active';
      // Update state to inactive.
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
