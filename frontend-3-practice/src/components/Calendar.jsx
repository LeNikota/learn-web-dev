import { buildCalendarGrid, isDateInPast, MONTHS_NOMINATIVE } from '../utils/dateHelpers';

const Calendar = ({ 
  currentYear, 
  currentMonth, 
  selectedDay, 
  onPrevMonth, 
  onNextMonth, 
  onDayClick 
}) => {
  const days = buildCalendarGrid(currentYear, currentMonth);

  return (
    <div className="calendar">
      <div className="calendar__header">
        <h2 className="calendar__title">
          {MONTHS_NOMINATIVE[currentMonth]} {currentYear}
        </h2>
        <div className="calendar__nav">
          <button className="calendar__nav-btn" onClick={onPrevMonth}>&lt;</button>
          <button className="calendar__nav-btn" onClick={onNextMonth}>&gt;</button>
        </div>
      </div>

      <div className="calendar__grid">
        <div className="calendar__weekday">Пн</div>
        <div className="calendar__weekday">Вт</div>
        <div className="calendar__weekday">Ср</div>
        <div className="calendar__weekday">Чт</div>
        <div className="calendar__weekday">Пт</div>
        <div className="calendar__weekday">Сб</div>
        <div className="calendar__weekday">Вс</div>

        {days.map((cell, index) => {
          const isSelected = 
            cell.fullDate.getFullYear() === currentYear &&
            cell.fullDate.getMonth() === currentMonth &&
            cell.fullDate.getDate() === selectedDay;
          
          const isInPast = !isDateInPast(cell.fullDate);
          
          const classes = ['calendar__day'];
          if (cell.otherMonth) classes.push('calendar__day_other-month');
          if (isSelected) classes.push('calendar__day_selected');
          if (isInPast) classes.push('calendar__day_disabled');

          return (
            <button
              key={index}
              className={classes.join(' ')}
              disabled={isInPast}
              onClick={() => onDayClick(cell.fullDate)}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;