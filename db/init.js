import database from './database.js';
import ProgramState from './ProgramState.js';

(async () => {
  await database.sync({ force: true });
  const program = await ProgramState.create({ state: 'inactive' });
  await program.save();
})();
