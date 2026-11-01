export const MONTHS_NOMINATIVE = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

const MONTHS_GENITIVE = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря"
];

const DAYS_OF_WEEK_FULL = [
  "Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"
];

export const DEFAULT_SLOTS = [
  { time: "10:00", available: false },
  { time: "11:00", available: false },
  { time: "12:00", available: false },
  { time: "13:00", available: false },
  { time: "14:00", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: true },
  { time: "18:00", available: true },
  { time: "19:00", available: true },
  { time: "20:00", available: true }
];

export const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

export function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  let startDayOfWeek = firstDay.getDay();
  if (startDayOfWeek === 0) startDayOfWeek = 7;
  // Convert to Mon=0 ... Sun=6
  else startDayOfWeek -= 1;

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const cells = [];

  // Previous month days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    cells.push({
      day: dayNum,
      otherMonth: true,
      fullDate: new Date(year, month - 1, dayNum)
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      otherMonth: false,
      fullDate: new Date(year, month, d)
    });
  }

  // Next month days
  const totalCells = Math.ceil(cells.length / 7) * 7;
  let nextDay = 1;
  while (cells.length < totalCells) {
    cells.push({
      day: nextDay,
      otherMonth: true,
      fullDate: new Date(year, month + 1, nextDay)
    });
    nextDay++;
  }

  return cells;
}

export function isDateInPast(dateObj) {
  return dateObj >= TODAY;
}

export function formatSelectedDateTime(year, month, day, time) {
  if (!day || !time) return "";
  const dateObj = new Date(year, month, day);
  const dayName = DAYS_OF_WEEK_FULL[dateObj.getDay()];
  const monthGenitive = MONTHS_GENITIVE[month];
  return `${dayName}, ${day} ${monthGenitive} ${year} • ${time}`;
}