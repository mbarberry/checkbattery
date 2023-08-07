import { spawn } from 'node:child_process';
import { updateState } from './db/db.js';

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
  const userIsAway = count > 6;
  const interval = userIsAway ? LONG_DELAY : SHORT_DELAY;

  const batt = spawn('pmset', ['-g', 'batt']);

  batt.stdout.on('data', async (data) => {
    const { charging, chargeLevel } = getChargingAndLevel(data);
    const takeOff = charging && chargeLevel >= 80;
    const putOn = !charging && chargeLevel <= 20;

    if (takeOff || putOn) {
      if (count === 0) {
        await updateState('active');
      }
      if (takeOff) {
        alert(TAKE_OFF_MSG);
      } else {
        alert(PUT_ON_MSG);
      }
      await wait(interval);
      checkBatt(count + 1);
    } else {
      if (count > 0) {
        console.log('Exiting after alerting.');
        await updateState('inactive');
        return;
      }
      console.log(
        `Current charge stats: charging (${charging}), chargeLevel(${chargeLevel})\n`
      );
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
