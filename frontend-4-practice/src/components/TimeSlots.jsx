const TimeSlots = ({ slots, loading, error, selectedDay, selectedTime, onTimeClick }) => {
  return (
    <div className="time-slots">
      <h3 className="time-slots__title">Доступное время</h3>

      {!selectedDay && <p className="time-slots__message">Выберите дату</p>}
      {selectedDay && loading && <p className="time-slots__message">Загрузка слотов…</p>}
      {selectedDay && !loading && error && (
        <p className="time-slots__message time-slots__message_error">{error}</p>
      )}
      {selectedDay && !loading && !error && slots.length === 0 && (
        <p className="time-slots__message">На этот день слотов нет</p>
      )}

      {selectedDay && !loading && !error && (
        <div className="time-slots__grid">
          {slots.map((slot, index) => {
            const isSelected = selectedTime === slot.time;
            const classes = ['time-slots__slot'];
            if (isSelected) classes.push('time-slots__slot_selected');
            if (!slot.available) classes.push('time-slots__slot_disabled');

            return (
              <button
                key={index}
                className={classes.join(' ')}
                disabled={!slot.available}
                onClick={() => onTimeClick(slot.time)}
              >
                {slot.time}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TimeSlots;