import { spawn } from 'node:child_process';

import { updateState, getState } from '../db/state.js';
import CheckBattery from './CheckBattery.js';
import {
  PUT_ON_MSG,
  TAKE_OFF_MSG,
  SHORT_DELAY,
  LONG_DELAY,
} from './constants.js';
import { getChargingAndLevel, sayAlert } from './utils.js';

// This class handles spawning
// child processes to get battery
// details and say alerts (if appropriate).

export default class Iteration {
  constructor(iteration) {
    this.iteration = iteration;
    this.delay = iteration >= 5 ? LONG_DELAY : SHORT_DELAY;
    this.alertMessage = null;
  }

  // Pmset child process wrapped in a
  // promise. Sends stdout to getChargingAndLevel
  // that parses output to return { charging, chargeLevel }.
  spawnPmset() {
    return new Promise((resolve, reject) => {
      const pmset = spawn('pmset', ['-g', 'batt']);

      pmset.stdout.on('data', (data) => {
        resolve(getChargingAndLevel(data));
      });

      pmset.stderr.on('data', (err) => {
        reject(`Error running Pmset\n${err}`);
      });

      pmset.on('close', (code) => {
        if (code !== 0) {
          CheckBattery.log({
            isFirst: false,
            message: `Pmset exited with error code:\n${code}`,
          });
        }
      });
    });
  }

  // Output from pmset promise passed here.
  // Determines if we should alert.
  // Sets correct alert message if so.
  alertCheck({ charging, chargeLevel }) {
    CheckBattery.log({
      isFirst: false,
      message: `charging: ${charging}, chargeLevel: ${chargeLevel}`,
    });

    const takeOff = charging && chargeLevel >= 80;
    const putOn = !charging && chargeLevel <= 20;

    CheckBattery.log({
      isFirst: false,
      message: `takeOff: ${takeOff}, putOn: ${putOn}`,
    });

    if (takeOff) {
      this.alertMessage = TAKE_OFF_MSG;
    }

    if (putOn) {
      this.alertMessage = PUT_ON_MSG;
    }
  }

  // Spawn alert child process.
  // Also update DB state if this is the
  // first one.
  async spawnAlert() {
    CheckBattery.log({
      isFirst: false,
      message: `*Alert condition met: ${
        this.alertMessage === TAKE_OFF_MSG ? 'takeOff' : 'putOn'
      }*`,
    });

    const isActive = (await getState()) === 'active';

    if (!isActive) {
      CheckBattery.log({ isFirst: false, message: 'Entering active state.' });

      await updateState('active');
    }

    sayAlert(this.alertMessage);
  }
}
