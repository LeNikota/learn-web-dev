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

const BASE_TIMES = [
  "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "18:00", "19:00", "20:00"
];

const DEFAULT_SLOTS = [
  { time: "10:00", available: true },
  { time: "11:00", available: true },
  { time: "12:00", available: true },
  { time: "13:00", available: true },
  { time: "14:00", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: true },
  { time: "18:00", available: true },
  { time: "19:00", available: true },
  { time: "20:00", available: true }
];

const SLOTS_DATA = initSlotsData();

function convertDateToString(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
}

function initSlotsData() {
  const stored = localStorage.getItem('slots_data');
  if (stored)
    return JSON.parse(stored);

  const newData = {};
  for (let i = 0; i < 7; i++) {
    const current = new Date();
    current.setDate(current.getDate() + i);
    const dateString = convertDateToString(current);

    newData[dateString] = BASE_TIMES.map(time => ({
      time,
      available: Math.random() > 0.5
    }));
  }

  localStorage.setItem('slots_data', JSON.stringify(newData));
  return newData;
}

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
  if (!day || !time) return "Выберите время";
  const dateObj = new Date(year, month, day);
  const dayName = DAYS_OF_WEEK_FULL[dateObj.getDay()];
  const monthGenitive = MONTHS_GENITIVE[month];
  return `${dayName}, ${day} ${monthGenitive} ${year}, ${time}`;
}

export function getSlotsForDate(year, month, day) {
  const targetDate = new Date(year, month, day);
  const dateString = convertDateToString(targetDate);

  return SLOTS_DATA[dateString] ? SLOTS_DATA[dateString] : DEFAULT_SLOTS;
}