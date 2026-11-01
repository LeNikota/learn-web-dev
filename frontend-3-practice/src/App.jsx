import React, { useState, useEffect } from 'react';
import './index.css';
import Header from './components/Header';
import Stepper from './components/Stepper';
import Calendar from './components/Calendar';
import TimeSlots from './components/TimeSlots';
import Footer from './components/Footer';
import { TODAY, formatSelectedDateTime } from './utils/dateHelpers';

function App() {
  // State
  const [currentYear, setCurrentYear] = useState(TODAY.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(TODAY.getMonth());
  const [selectedDay, setSelectedDay] = useState(TODAY.getDate());
  const [selectedTime, setSelectedTime] = useState(null);

  // Handlers
  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 0) {
        setCurrentYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
    resetSelection();
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 11) {
        setCurrentYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
    resetSelection();
  };

  const resetSelection = () => {
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const handleDayClick = (dateObj) => {
    setSelectedDay(dateObj.getDate());
    if (dateObj.getMonth() !== currentMonth || dateObj.getFullYear() !== currentYear) {
        setCurrentMonth(dateObj.getMonth());
        setCurrentYear(dateObj.getFullYear());
    }
    setSelectedTime(null);
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  // Derived state for form-action
  // const BookingSummary = formatSelectedDateTime(
  //   currentYear, 
  //   currentMonth, 
  //   selectedDay, 
  //   selectedTime
  // );

  return (
    <div className="App">
      <Header/>
      <Stepper/>
      
      <main className="booking">
        <div className="form-header">
          <a href="#" className="form-header__back-link">← Назад</a>
          <h1 className="form-header__title">Дата и время</h1>
          <p className="form-header__subtitle">Найдите удобное окошко в расписании мастера.</p>
        </div>

        <div className="form-booking">
          <Calendar 
            currentYear={currentYear}
            currentMonth={currentMonth}
            selectedDay={selectedDay}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onDayClick={handleDayClick}
          />

          <TimeSlots 
            selectedTime={selectedTime}
            onTimeClick={handleTimeClick}
          />
        </div>

        <div className="form-actions">
           {/* {BookingSummary} */}

           <button 
             className={`form__button ${!selectedDay || !selectedTime ? 'disabled' : ''}`}
             disabled={!selectedDay || !selectedTime}
           >
             Далее
           </button>
        </div>
      </main>

      <Footer/>
    </div>
  );
}

export default App;