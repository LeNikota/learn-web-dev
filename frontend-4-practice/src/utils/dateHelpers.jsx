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

export function isDateInPast(dateObj, today) {
  const t = new Date(today.year, today.month, today.day);
  t.setHours(0, 0, 0, 0);
  return dateObj < t;
}

export function formatSelectedDateTime(year, month, day, time) {
  if (!day) return "Выберите дату и время";

  const dateObj = new Date(year, month, day);
  const dayName = DAYS_OF_WEEK_FULL[dateObj.getDay()];
  const monthGenitive = MONTHS_GENITIVE[month];
  const dateStr = `${dayName}, ${day} ${monthGenitive} ${year}`;

  return time ? `${dateStr}, ${time}` : dateStr;
}