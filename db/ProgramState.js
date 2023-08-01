import { DataTypes } from 'sequelize';
import database from './database.js';

const ProgramState = database.define('programState', {
  state: {
    type: DataTypes.TEXT,
    get() {
      return this.getDataValue('state');
    },
    set(state) {
      this.setDataValue('state', state);
    },
  },
});

export default ProgramState;
