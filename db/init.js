import { db } from './db.js';

db.run('CREATE TABLE IF NOT EXISTS programState ( state VARCHAR(255) )');

db.run(
  `INSERT INTO programState (state) VALUES ('inactive');`,
  [],
  (err, data) => console.log(err, data)
);
