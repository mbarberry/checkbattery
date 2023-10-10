import { getState, updateState } from './state.js';

// Script invoked with no args
// gets the state. With an arg
// it will be set to whatever
// that is.

(async () => {
  if (process.argv.length > 2) {
    await updateState(process.argv[2]);
  } else {
    console.log(await getState());
  }
})();
