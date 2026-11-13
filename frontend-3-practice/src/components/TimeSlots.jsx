import { getSlotsForDate } from '../utils/dateHelpers';

const TimeSlots = ({ currentYear, currentMonth, selectedDay, selectedTime, onTimeClick }) => {
  const slots = getSlotsForDate(currentYear, currentMonth, selectedDay)

  return (
    <div className="time-slots">
      <h3 className="time-slots__title">Доступное время</h3>
      <div className="time-slots__grid">
        {slots.map((slot, index) => {
          const isSelected = selectedTime === slot.time;
          const isDisabled = !slot.available || !selectedDay;

          const classes = ['time-slots__slot'];
          if (isSelected) classes.push('time-slots__slot_selected');
          if (isDisabled) classes.push('time-slots__slot_disabled');

          return (
            <button
              key={index}
              className={classes.join(' ')}
              disabled={isDisabled}
              onClick={() => onTimeClick(slot.time)}
            >
              {slot.time}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlots;