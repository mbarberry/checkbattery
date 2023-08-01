const DAY_MAP = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday',
};

const MONTH_MAP = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
};

function timestamp() {
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
}

export default timestamp;
