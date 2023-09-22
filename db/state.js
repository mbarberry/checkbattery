import { db } from './db.js';

export function getState() {
  return new Promise((resolve, reject) => {
    db.get('SELECT * from programState', [], (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data.state);
    });
  });
}

export function updateState(newState) {
  return new Promise((resolve, reject) => {
    db.run(`UPDATE programState SET state = '${newState}';`, [], (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}
