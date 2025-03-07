document.addEventListener('DOMContentLoaded', function () {
    const calendarElement = document.getElementById('calendar');
    const eventListElement = document.getElementById('event-list');
    const newEventInput = document.getElementById('new-event');
    const addEventButton = document.getElementById('add-event');
    const monthYearElement = document.getElementById('month-year');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');

    let selectedDate = null;
    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    function createCalendar(month, year) {
        const firstDay = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();
        const storedEvents = JSON.parse(localStorage.getItem('events')) || {};
        
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        monthYearElement.textContent = `${monthNames[month]} ${year}`;

        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const table = document.createElement('table');
        let row = document.createElement('tr');

        daysOfWeek.forEach(day => {
            const th = document.createElement('th');
            th.textContent = day;
            row.appendChild(th);
        });
        table.appendChild(row);

        let dayCounter = 1;
        for (let i = 0; i < 6; i++) {
            row = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                const td = document.createElement('td');
                if (i === 0 && j < firstDay) {
                    td.textContent = '';
                } else if (dayCounter > lastDay) {
                    td.textContent = '';
                } else {
                    let dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayCounter).padStart(2, '0')}`;
                    td.dataset.date = dateStr;

                    let eventsForDay = storedEvents[dateStr] || [];
                    if (eventsForDay.length > 0) {
                        td.style.backgroundColor = '#FFD700'; // Желтый цвет, если есть события
                    }

                    if (dayCounter === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                        td.style.border = '2px solid red'; // Подсвечиваем текущий день
                    }

                    td.textContent = dayCounter;
                    td.addEventListener('click', function () {
                        selectDate(td, dateStr);
                    });

                    dayCounter++;
                }
                row.appendChild(td);
            }
            table.appendChild(row);
            if (dayCounter > lastDay) break;
        }

        calendarElement.innerHTML = '';
        calendarElement.appendChild(table);
    }

    function selectDate(cell, dateStr) {
        document.querySelectorAll('td').forEach(td => td.classList.remove('selected'));
        cell.classList.add('selected');
        selectedDate = dateStr;
        updateEventList();
    }

    function updateEventList() {
        if (!selectedDate) return;
        const storedEvents = JSON.parse(localStorage.getItem('events')) || {};
        const eventsForDay = storedEvents[selectedDate] || [];

        eventListElement.innerHTML = '';
        eventsForDay.forEach(event => {
            const li = document.createElement('li');
            li.classList.add('event-item');
            li.innerHTML = `<strong>${selectedDate}:</strong> ${event}`;
            eventListElement.appendChild(li);
        });
    }

    addEventButton.addEventListener('click', function () {
        if (!selectedDate || newEventInput.value.trim() === '') return;

        const storedEvents = JSON.parse(localStorage.getItem('events')) || {};
        if (!storedEvents[selectedDate]) {
            storedEvents[selectedDate] = [];
        }

        storedEvents[selectedDate].push(newEventInput.value.trim());
        localStorage.setItem('events', JSON.stringify(storedEvents));

        newEventInput.value = '';
        updateEventList();
        createCalendar(currentMonth, currentYear); // Перерисовываем календарь, чтобы обновить цвета
    });

    prevMonthButton.addEventListener('click', function () {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        createCalendar(currentMonth, currentYear);
    });

    nextMonthButton.addEventListener('click', function () {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        createCalendar(currentMonth, currentYear);
    });

    createCalendar(currentMonth, currentYear);
});