import { DEFAULT_SLOTS } from '../utils/dateHelpers';

const TimeSlots = ({ selectedTime, onTimeClick }) => {
  return (
    <div className="time-slots">
      <h3 className="time-slots__title">Доступное время</h3>
      <div className="time-slots__grid">
        {DEFAULT_SLOTS.map((slot, index) => {
          const isSelected = selectedTime === slot.time;
          const isBusy = !slot.available;
          
          const classes = ['time-slots__slot'];
          if (isSelected) classes.push('time-slots__slot_selected');
          if (isBusy) classes.push('time-slots__slot_busy');

          return (
            <button
              key={index}
              className={classes.join(' ')}
              disabled={isBusy}
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