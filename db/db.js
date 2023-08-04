import sqlite3 from 'sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = new sqlite3.Database(path.join(__dirname, 'db.sqlite'));

db.run('CREATE TABLE IF NOT EXISTS programState ( state VARCHAR(255) )');

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
