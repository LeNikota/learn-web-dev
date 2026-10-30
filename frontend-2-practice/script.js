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
    { time: "10:00", available: false },
    { time: "11:00", available: false },
    { time: "12:00", available: false },
    { time: "13:00", available: false },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
    { time: "18:00", available: true },
    { time: "19:00", available: true },
    { time: "20:00", available: true }
];



// 2. States
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);
const state = {
    currentYear: TODAY.getFullYear(),
    currentMonth: TODAY.getMonth(),
    selectedDay: TODAY.getDate(),
    selectedTime: null,
};




// 3. Pure function
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




// 4. Rendering and handlers
let elements = {};
elements.title = document.querySelector('.calendar__title');
elements.gridContainer = document.querySelector('.calendar__grid');
elements.prevBtn = document.querySelectorAll('.calendar__nav-btn')[0];
elements.nextBtn = document.querySelectorAll('.calendar__nav-btn')[1];
elements.slotsContainer = document.querySelector('.time-slots__grid');
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
    //!!! Delete this line when data is fetch from AP
    DEFAULT_SLOTS.forEach(slot => slot.available = Math.random() > 0.5);

    buttonElements.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget;
            const year = parseInt(target.dataset.year);
            const month = parseInt(target.dataset.month);
            const day = parseInt(target.dataset.day);

            state.currentYear = year;
            state.currentMonth = month;
            state.selectedDay = day;
            state.selectedTime = null;

            renderCalendarHeader();
            renderCalendarGrid();
            renderTimeSlots();
            updateBottomBarVisuals();
        });
    });
}

function renderTimeSlots() {
    if (!elements.slotsContainer) return;

    let html = '';

    DEFAULT_SLOTS.forEach(slot => {
        const isSelected = state.selectedTime === slot.time;
        const isBusy = !slot.available;

        let classes = ['time-slots__slot'];
        if (isSelected) classes.push('time-slots__slot_selected');
        if (isBusy) classes.push('time-slots__slot_busy');

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
    if (elements.nextStepBtn) {
        if (state.selectedDay && state.selectedTime) {
            elements.nextStepBtn.classList.remove('disabled');
        } else {
            elements.nextStepBtn.classList.add('disabled');
        }
    }

    console.log(printFormatSelectedDateTime());
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




// 5. Initialization
function init() {
    renderCalendarHeader();
    renderCalendarGrid();
    renderTimeSlots();
    updateBottomBarVisuals();
    setupMonthNavigation();
}
document.addEventListener('DOMContentLoaded', init);