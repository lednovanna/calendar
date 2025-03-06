document.addEventListener('DOMContentLoaded', function () {
    const calendarElement = document.getElementById('calendar');
    const eventListElement = document.getElementById('event-list');
    const newEventInput = document.getElementById('new-event');
    const addEventButton = document.getElementById('add-event');

    let selectedDate = null;

    // Функция для создания календаря
    function createCalendar() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();  // День недели 1ое число

        // Таблица
        const table = document.createElement('table');
        let row = document.createElement('tr');

        
        const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
        daysOfWeek.forEach(day => {
            const th = document.createElement('th');
            th.textContent = day;
            row.appendChild(th);
        });
        table.appendChild(row);

        // дни месяца
        let dayCell = 0;
        for (let i = 0; i < 6; i++) {
            row = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                const td = document.createElement('td');
                if (i === 0 && j < startingDay || dayCell >= daysInMonth) {
                    td.textContent = '';
                } else {
                    td.textContent = ++dayCell;
                    td.addEventListener('click', () => selectDate(dayCell));
                }
                row.appendChild(td);
            }
            table.appendChild(row);
            if (dayCell >= daysInMonth) break;
        }

        calendarElement.innerHTML = '';
        calendarElement.appendChild(table);
    }

    // Выбор даты
    function selectDate(day) {
        selectedDate = new Date(new Date().getFullYear(), new Date().getMonth(), day);
        updateEventList();
    }

    
    function updateEventList() {
        if (!selectedDate) return;
        const storedEvents = JSON.parse(localStorage.getItem('events')) || {};
        const dateKey = selectedDate.toDateString();
        const eventsForDay = storedEvents[dateKey] || [];

        eventListElement.innerHTML = '';
        eventsForDay.forEach(event => {
            const li = document.createElement('li');
            li.classList.add('event-item');
            li.textContent = event;
            eventListElement.appendChild(li);
        });
    }

    // Добавление событий
    addEventButton.addEventListener('click', function () {
        if (!selectedDate || newEventInput.value.trim() === '') return;

        const storedEvents = JSON.parse(localStorage.getItem('events')) || {};
        const dateKey = selectedDate.toDateString();
        const eventsForDay = storedEvents[dateKey] || [];

        eventsForDay.push(newEventInput.value.trim());
        storedEvents[dateKey] = eventsForDay;

        localStorage.setItem('events', JSON.stringify(storedEvents));

        newEventInput.value = '';  // очищаємо поле вводу
        updateEventList();  // оновлюємо список подій
    });

    createCalendar();
});