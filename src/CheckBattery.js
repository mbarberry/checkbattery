import { updateState, getState } from '../db/state.js';
import Iteration from './Iteration.js';
import { TAKE_OFF_MSG } from './constants.js';
import { timestamp, wait } from './utils.js';

// This class handles program flow
// and logging.

export default class CheckBattery {
  static on = true;
  static iterationNum = 0;

  // Run if not already active.
  static async main() {
    this.log({
      isFirst: true,
      message: `${timestamp()} Battery checker job starting...`,
    });

    const programState = await getState();

    if (programState === 'active') {
      this.log({
        isFirst: false,
        message: 'Program is already active: exiting.',
      });
    } else {
      this.run();
    }
  }

  // Alert, wait and run
  // another iteration if
  // a condition is met.
  static async run() {
    while (this.on) {
      const iteration = new Iteration(this.iterationNum);

      try {
        const { shouldAlert, alertMessage } = iteration.alertCheck(
          await iteration.spawnPmset()
        );

        if (shouldAlert) {
          await iteration.alert({
            alertType: alertMessage === TAKE_OFF_MSG ? 'takeOff' : 'putOn',
          });
          await wait(iteration.delay);
          this.iterationNum++;
        } else {
          this.on = false;
        }
      } catch (e) {
        this.log({ isFirst: false, message: `Error in try block: ${e}` });
      }
    }

    await this.close();
  }

  // Update DB state if currently active.
  static async close() {
    this.log({ isFirst: false, message: 'Alert condition not met.' });

    const isActive = (await getState()) === 'active';

    if (isActive) {
      this.log({ isFirst: false, message: 'Updating state to inactive.' });

      await updateState('inactive');
    }
  }

  static log({ isFirst, message }) {
    isFirst && console.log('\n');
    console.log(`Iteration #${this.iterationNum} --- ${message}`);
  }
}
