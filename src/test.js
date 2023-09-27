import { getState, updateState } from '../db/state.js';

// Pass state as script arg to
// update. Or get state with no
// args.

(async () => {
  if (process.argv.length > 2) {
    await updateState(process.argv[2]);
  } else {
    console.log(await getState());
  }
})();
