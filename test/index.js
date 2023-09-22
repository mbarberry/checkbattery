import { getState, updateState } from '../db/state.js';

(async () => {
  if (process.argv.length > 2) {
    await updateState(process.argv[2]);
  } else {
    console.log(await getState());
  }
})();
