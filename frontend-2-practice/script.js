// 1. Data
const MONTHS_NOMINATIVE = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

const MONTHS_GENITIVE = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
];

// У dateObj.getDay() 0 - это воскресенье.
const DAYS_OF_WEEK_FULL = [
    "Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"
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

const SLOTS_DATA = initSlotsData()




// 2. States
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);
const state = {
    currentYear: TODAY.getFullYear(),
    currentMonth: TODAY.getMonth(),
    selectedDay: TODAY.getDate(),
    selectedTime: null,
};




// 3. Pure functions
function buildCalendarGrid(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // getDay(): 0 = Вс, 1 = Пн ... 6 = Сб
    let startDayOfWeek = firstDay.getDay();
    if (startDayOfWeek === 0) startDayOfWeek = 7;
    else startDayOfWeek -= 1;

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const cells = [];

    // Дни предыдущего месяца
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const dayNum = prevMonthLastDay - i;
        cells.push({
            day: dayNum,
            otherMonth: true,
            fullDate: new Date(year, month - 1, dayNum)
        });
    }

    // Дни текущего месяца
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({
            day: d,
            otherMonth: false,
            fullDate: new Date(year, month, d)
        });
    }

    // Дни следующего месяца
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

function isDateInPast(dateObj) {
    return dateObj >= TODAY;
}

function printFormatSelectedDateTime() {
    if (!state.selectedDay || !state.selectedTime) return "";

    const dateObj = new Date(state.currentYear, state.currentMonth, state.selectedDay);
    const dayName = DAYS_OF_WEEK_FULL[dateObj.getDay()];
    const monthGenitive = MONTHS_GENITIVE[state.currentMonth];

    return `${dayName}, ${state.selectedDay} ${monthGenitive} ${state.currentYear} • ${state.selectedTime}`;
}

function convertDateToString(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
}

function getCurrentDateAsString() {
    const m = String(state.currentMonth + 1).padStart(2, '0');
    const d = String(state.selectedDay).padStart(2, '0');
    return `${state.currentYear}-${m}-${d}`;
}

// Not pure, generates data using Math.random()
function initSlotsData() {
    const BASE_TIMES = [
        "10:00", "11:00", "12:00", "13:00", "14:00",
        "15:00", "16:00", "18:00", "19:00", "20:00"
    ];

    const storedSlotsData = localStorage.getItem("slots_data")

    if (storedSlotsData)
        return JSON.parse(storedSlotsData);

    const slotsData = {};
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + i);
        const currentDateString = convertDateToString(currentDate)

        slotsData[currentDateString] = BASE_TIMES.map(time => ({ time, available: Math.random() > 0.5 }))
    }

    localStorage.setItem("slots_data", JSON.stringify(slotsData));

    return slotsData;
}

// Not pure, access global state
function validateSelectedTime() {
    if (!state.selectedDay || !state.selectedTime) return;

    const currentDateString = getCurrentDateAsString();

    const slotsForCurrentDate = SLOTS_DATA[currentDateString] || DEFAULT_SLOTS;

    const selectedSlot = slotsForCurrentDate.find(slot => slot.time === state.selectedTime);

    if (!selectedSlot || !selectedSlot.available) {
        state.selectedTime = null;
    }
}


// 4. Rendering and handlers
let elements = {};
elements.title = document.querySelector('.calendar__title');
elements.gridContainer = document.querySelector('.calendar__grid');
elements.prevBtn = document.querySelectorAll('.calendar__nav-btn')[0];
elements.nextBtn = document.querySelectorAll('.calendar__nav-btn')[1];
elements.slotsContainer = document.querySelector('.time-slots__grid');
elements.summaryPanel = document.querySelector('.form-booking__summary');
elements.nextStepBtn = document.querySelector('.form__button');

function renderCalendarHeader() {
    elements.title.textContent = `${MONTHS_NOMINATIVE[state.currentMonth]} ${state.currentYear}`;
}

function renderCalendarGrid() {
    const days = buildCalendarGrid(state.currentYear, state.currentMonth);
    let html = '';

    const weekdaysHtml = `
        <div class="calendar__weekday">Пн</div>
        <div class="calendar__weekday">Вт</div>
        <div class="calendar__weekday">Ср</div>
        <div class="calendar__weekday">Чт</div>
        <div class="calendar__weekday">Пт</div>
        <div class="calendar__weekday">Сб</div>
        <div class="calendar__weekday">Вс</div>
    `;

    html += weekdaysHtml;

    days.forEach(cell => {
        const isSelected = cell.fullDate.getFullYear() === state.currentYear &&
            cell.fullDate.getMonth() === state.currentMonth &&
            cell.fullDate.getDate() === state.selectedDay;

        const isOtherMonth = cell.otherMonth;
        const isInPast = !isDateInPast(cell.fullDate);

        let classes = ['calendar__day'];
        if (isOtherMonth) classes.push('calendar__day_other-month');
        if (isSelected) classes.push('calendar__day_selected');
        if (isInPast) classes.push('calendar__day_disabled');

        // Data attributes для обработки кликов
        const attrs = `data-year="${cell.fullDate.getFullYear()}" data-month="${cell.fullDate.getMonth()}" data-day="${cell.day}"`;
        const isDisabled = isInPast;

        html += `<button class="${classes.join(' ')}" ${attrs} ${isDisabled ? 'disabled' : ''}>${cell.day}</button>`;
    });

    elements.gridContainer.innerHTML = html;
    buttonElements = [...elements.gridContainer.children].slice(7);
    attachDayClickHandlers(buttonElements);
}

function attachDayClickHandlers(buttonElements) {
    buttonElements.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget;
            const year = parseInt(target.dataset.year);
            const month = parseInt(target.dataset.month);
            const day = parseInt(target.dataset.day);

            state.currentYear = year;
            state.currentMonth = month;
            state.selectedDay = day;
            validateSelectedTime();

            renderCalendarHeader();
            renderCalendarGrid();
            renderTimeSlots();
            updateBottomBarVisuals();
        });
    });
}

function renderTimeSlots() {
    let html = '';

    slots = SLOTS_DATA[getCurrentDateAsString()] ? SLOTS_DATA[getCurrentDateAsString()] : DEFAULT_SLOTS;

    slots.forEach(slot => {
        const isSelected = state.selectedTime === slot.time;
        const isBusy = !slot.available || !state.selectedDay;

        let classes = ['time-slots__slot'];
        if (isSelected) classes.push('time-slots__slot_selected');
        if (isBusy) classes.push('time-slots__slot_disabled');

        const isDisabled = isBusy;

        html += `<button class="${classes.join(' ')}" data-time="${slot.time}" ${isDisabled ? 'disabled' : ''}>${slot.time}</button>`;
    });

    elements.slotsContainer.innerHTML = html;
    buttonElements = [...elements.slotsContainer.children];
    attachTimeSlotClickHandlers(buttonElements);
}

function attachTimeSlotClickHandlers(buttonElements) {
    buttonElements.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget;
            state.selectedTime = target.dataset.time;

            renderTimeSlots();
            updateBottomBarVisuals();
        });
    });
}

function updateBottomBarVisuals() {
    const hasSelection = state.selectedDay && state.selectedTime;

    if (hasSelection) {
        const formattedDate = printFormatSelectedDateTime();
        elements.summaryPanel.textContent = formattedDate;
        elements.summaryPanel.classList.add('active');
    } else {
        elements.summaryPanel.textContent = "Выберите дату и время";
        elements.summaryPanel.classList.remove('active');
    }

    if (hasSelection) {
        elements.nextStepBtn.removeAttribute('disabled');
    } else {
        elements.nextStepBtn.setAttribute('disabled', 'true');
    }
}

function setupMonthNavigation() {
    if (elements.prevBtn) {
        elements.prevBtn.addEventListener('click', () => {
            state.currentMonth--;
            if (state.currentMonth < 0) {
                state.currentMonth = 11;
                state.currentYear--;
            }

            state.selectedDay = null;
            state.selectedTime = null;

            renderCalendarHeader();
            renderCalendarGrid();
            renderTimeSlots();
            updateBottomBarVisuals();
        });
    }

    if (elements.nextBtn) {
        elements.nextBtn.addEventListener('click', () => {
            state.currentMonth++;
            if (state.currentMonth > 11) {
                state.currentMonth = 0;
                state.currentYear++;
            }

            state.selectedDay = null;
            state.selectedTime = null;

            renderCalendarHeader();
            renderCalendarGrid();
            renderTimeSlots();
            updateBottomBarVisuals();
        });
    }
}

function setupNextButtonHandler() {
    elements.nextStepBtn.addEventListener('click', () => {
        if (!state.selectedDay || !state.selectedTime) {
            alert("Пожалуйста, выберите дату и время.");
            return;
        }

        const finalMessage = printFormatSelectedDateTime();

        alert(`Вы выбрали:\n${finalMessage}`);
    });
}




// 5. Initialization
function init() {
    renderCalendarHeader();
    renderCalendarGrid();
    renderTimeSlots();
    updateBottomBarVisuals();
    setupMonthNavigation();
    setupNextButtonHandler();
}
document.addEventListener('DOMContentLoaded', init);