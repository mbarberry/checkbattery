import { spawn } from 'node:child_process';

import { DAY_MAP, MONTH_MAP } from './constants.js';

export const timestamp = () => {
  const now = new Date();
  const date = {
    year: now.getFullYear(),
    month: MONTH_MAP[now.getMonth()],
    date: now.getDate(),
    day: DAY_MAP[now.getDay()],
    hour: now.getHours(),
    minutes: now.getMinutes(),
  };
  return `${date.day} ${date.month} ${date.date} ${date.hour}:${date.minutes} ${date.year}`;
};

export const sayAlert = (message) => {
  spawn('say', [message]);
};

export const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export const getChargeLevel = (str) => {
  const tail = str.slice(str.indexOf('\t'));
  let level = '';
  let idx = 0;
  while (idx < tail.length && tail[idx] !== '%') {
    level += tail[idx];
    idx++;
  }
  return Number(level);
};

// Charging is either: (1) "Battery", not charging, or
// (2) "AC", is charging.
export const getChargingAndLevel = (data) => {
  const status = data.toString();
  const lines = status.split('\n');
  const charging = lines[0].includes('AC');
  const chargeLevel = getChargeLevel(lines[1]);
  return { charging, chargeLevel };
};
