import { spawn } from 'node:child_process';

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

const alert = () => {
  const message = process.argv[2];
  spawn('say', [message]);
};

function checkBatt() {
  const batt = spawn('pmset', ['-g', 'batt']);

  batt.stdout.on('data', async (data) => {
    const status = data.toString();
    const lines = status.split('\n');
    // Will be either Battery or AC.
    const charging = lines[0].includes('AC');
    const chargeLevel = getChargeLevel(lines[1]);
    // We're on the charger and at or above 80
    // already. Trigger alert.
    if (charging && chargeLevel >= 80) {
      alert();
      // Pause.
      await wait(10000);
      // Recurse.
      checkBatt();
    } else {
      // Alert condition not met. Just log stats and exit.
      console.log(
        `Current charge stats: charging (${charging}), chargeLevel(${chargeLevel})\n`
      );
    }
  });

  batt.stderr.on('data', (err) => {
    console.log(`batt error: ${err}`);
  });

  batt.on('close', (code) => {
    if (code !== 0) {
      console.log(`batt process exited with code ${code}`);
    }
  });
}

export default checkBatt;
