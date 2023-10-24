import { updateState, getState } from '../db/state.js';
import Iteration from './Iteration.js';
import { timestamp, wait } from './utils.js';

// This class handles program flow
// and logging.

export default class CheckBattery {
  static on = true;
  static iterationNum = 0;

  // Main driver.
  // Doesn't run main code if
  // another process of this code is
  // already running on the machine.
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

  // Main functional logic.
  // Keeps a while loop going as long as
  // alert conditions keep getting met.
  static async run() {
    while (this.on) {
      const iteration = new Iteration(this.iterationNum);

      try {
        iteration.alertCheck(await iteration.spawnPmset());

        if (iteration.alertMessage) {
          await iteration.spawnAlert();
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

  // Updates DB state before shutting off.
  static async close() {
    this.log({ isFirst: false, message: 'Alert condition not met.' });

    const isActive = (await getState()) === 'active';

    if (isActive) {
      this.log({ isFirst: false, message: 'Updating state to inactive.' });

      await updateState('inactive');
    }
  }

  // Console log with an extra feature of
  // adding an extra space for the first so
  // telling between different runs is easy.
  static log({ isFirst, message }) {
    isFirst && console.log('\n');
    console.log(`Iteration #${this.iterationNum} --- ${message}`);
  }
}
