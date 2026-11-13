import { formatSelectedDateTime } from '../utils/dateHelpers';

const BookingSummary = ({ currentYear, currentMonth, selectedDay, selectedTime }) => {
  const bookingSummary = formatSelectedDateTime(
    currentYear,
    currentMonth,
    selectedDay,
    selectedTime
  );

  const handleNextButtonClick = () => {
    alert(`Вы выбрали:\n${bookingSummary}`);
  }


  return (
    <div className="form-booking__footer">
      <span className="form-booking__summary">{bookingSummary}</span>

      <button
        type="button"
        className="form__button"
        disabled={!selectedDay || !selectedTime}
        onClick={handleNextButtonClick}
      >
        Далее
      </button>
    </div>
  );
};

export default BookingSummary;