import { useState, useEffect } from 'react';
import './index.css';
import Header from './components/Header';
import Stepper from './components/Stepper';
import Calendar from './components/Calendar';
import TimeSlots from './components/TimeSlots';
import BookingSummary from './components/BookingSummary';
import Footer from './components/Footer';
import { fetchToday, fetchSlots } from './api';

function App() {
  const [today, setToday] = useState(null);
  const [todayLoading, setTodayLoading] = useState(true);
  const [todayError, setTodayError] = useState(null);

  const [currentYear, setCurrentYear] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadToday() {
      setTodayLoading(true);
      setTodayError(null);
      try {
        const data = await fetchToday();
        if (cancelled) return;
        setToday(data);
        setCurrentYear(data.year);
        setCurrentMonth(data.month);
        setSelectedDay(data.day);
      } catch (e) {
        if (!cancelled) setTodayError(e.message || 'Не удалось загрузить дату');
      } finally {
        if (!cancelled) setTodayLoading(false);
      }
    }

    loadToday();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!today || selectedDay == null) return;

    let cancelled = false;
    const date = { day: selectedDay, month: currentMonth, year: currentYear };

    async function loadSlots() {
      setSlotsLoading(true);
      setSlotsError(null);
      setSlots([]);
      try {
        const data = await fetchSlots(date);
        if (cancelled) return;
        const d = data.date;
        if (d.day !== selectedDay || d.month !== currentMonth || d.year !== currentYear) return;
        setSlots(data.slots, date, today);
      } catch (e) {
        if (!cancelled) setSlotsError(e.message || 'Не удалось загрузить слоты');
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    }

    loadSlots();
    return () => { cancelled = true; };
  }, [today, selectedDay, currentMonth, currentYear]);

  // Handlers
  const resetSelection = () => {
    setSelectedDay(null);
    setSelectedTime(null);
    setSlots([]);
    setSlotsError(null);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
    resetSelection();
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
    resetSelection();
  };

  const handleDayClick = (dateObj) => {
    setSelectedDay(dateObj.getDate());
    setCurrentMonth(dateObj.getMonth());
    setCurrentYear(dateObj.getFullYear());
    setSelectedTime(null);
  };

  const handleTimeClick = (time) => setSelectedTime(time);

  let content;
  if (todayLoading) {
    content = <p className="booking__message">Загрузка…</p>;
  } else if (todayError) {
    content = <p className="booking__message booking__message_error">Ошибка: {todayError}</p>;
  } else {
    content = (
      <div className="form-booking">
        <Calendar
          today={today}
          currentYear={currentYear}
          currentMonth={currentMonth}
          selectedDay={selectedDay}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onDayClick={handleDayClick}
        />
        <TimeSlots
          slots={slots}
          loading={slotsLoading}
          error={slotsError}
          selectedDay={selectedDay}
          selectedTime={selectedTime}
          onTimeClick={handleTimeClick}
        />
        <BookingSummary
          currentYear={currentYear}
          currentMonth={currentMonth}
          selectedDay={selectedDay}
          selectedTime={selectedTime}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <Stepper />
      <main className="booking">
        <div className="form-header">
          <a href="#" className="form-header__back-link">← Назад</a>
          <h1 className="form-header__title">Дата и время</h1>
          <p className="form-header__subtitle">Найдите удобную дату и время в расписании мастера.</p>
        </div>
        {content}
      </main>
      <Footer />
    </div>
  );
}

export default App;