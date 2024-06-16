import process from 'node:process';
import { updateState, getState } from '../db/state.js';
import CheckBattery from './CheckBattery.js';

const RUNNING = true;

const checkState = async () => {
  // Log a message when a signal is received
  CheckBattery.log({ isFirst: false, message: 'SIG received.' });

  // Get the current state from the database
  const programState = await getState();

  // If the program state is 'active', update it to 'inactive'
  if (programState === 'active') {
    await updateState('inactive');
  }

  // Exit the process with a success status
  process.exit(0);
};

// Register signal handlers
process.on('SIGTERM', checkState);
process.on('SIGINT', checkState);

// Note: Handling SIGKILL is not possible, as it forcefully terminates the process.

// Log the exit code when the process exits
process.on('exit', (code) => {
  console.log(`Program exiting with code ${code}`);
});

// Start the main function of my program
if (RUNNING) {
  CheckBattery.main();
}
