const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь"
];

const week = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье"
];

let curr = new Date();

function getDayOfWeekNumber(day) {
  if (day === 0) return 6;
  return day - 1;
}

function compareDates(date1, date2) {
  /**
   * Checks if two dates are equal
   *
   * @param {date} date1 - first date
   * @param {date} date2 - second date
   * @return {bool} - true if dates are equal, and false otherwise
   */
  if (date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()) {
    return true;
  }
  return false;
}

function renderDay(date, withDayOfWeek) {
  let currentDate = new Date();
  let day = document.createElement('DIV');
  day.classList.add('day');
  if (compareDates(currentDate, date)) day.classList.add('day--today');
  day.dataset.date = date;
  let span = document.createElement('SPAN');
  span.classList.add('day__date');
  span.innerHTML = withDayOfWeek ?
    `${week[getDayOfWeekNumber(date.getDay())]}, ${date.getDate()}` :
    `${date.getDate()}`;
  day.appendChild(span);
  let existingEvent = findEvent(date).event;
  if (existingEvent) {
    let eventContent = document.createElement('DIV');
    eventContent.innerHTML = `
      <div>${existingEvent.name}</div>
      <div>${existingEvent.participants}</div>
      <div>${existingEvent.description}</div>
    `;
    day.classList.add('day--with-event');
    day.appendChild(eventContent);
  }
  return day;
}

function renderMonth(year, month, days) {
  let calendar = document.querySelector('.content');
  let weeksNumber = Math.round(days.length/week.length);
  let counter = 0;
  for (let i = 0; i < weeksNumber; i++) {
    let weekDiv = document.createElement('DIV');
    weekDiv.classList.add('week');
    for (let j = 0; j < week.length; j++) {
      let date = new Date(year, month, days[counter]);
      let day = renderDay(date, counter < 7);
      weekDiv.appendChild(day);
      ++counter;
    }
    calendar.appendChild(weekDiv);
  }
}

function getDateInfo(date) {
  return {
    year : date.getFullYear(),
    month : date.getMonth(),
    day : date.getDate(),
    dayOfWeek : getDayOfWeekNumber(date.getDay())
  };
}

function resetEventForm() {
  let content = document.querySelector('.content-container');
  let eventForm = document.querySelector('.event');
  if (eventForm) {
    eventForm.classList.add('hidden');
    content.appendChild(eventForm);
  }
}
function resetContent() {
  let calendar = document.querySelector('.content');
  calendar.innerHTML = '';
}

function setCurrentMonthYear(month, year) {
  let dateContainer = document.querySelector('.date-current');
  dateContainer.innerHTML = `${months[month]} ${year}`;
}
function calcDaysArray(month, year) {
  let monthLenght = new Date(year, month + 1, 0).getDate();
  let days = [...new Array(monthLenght).keys()].map(day => day + 1);
  let firstDay = getDayOfWeekNumber(new Date(year, month, 1).getDay());
  let lastDay = getDayOfWeekNumber(new Date(year, month + 1, 0).getDay());
  if (firstDay !== 0) {
    let num = 0;
    for (let i = 0; i < firstDay; i++) {
      days.unshift(num);
      num--;
    }
  }
  if (lastDay !== 6) {
    let num = monthLenght + 1;
    for (let i = 0; i < week.length - lastDay; i++) {
      days.push(num);
      num++;
    }
  }
  return days;
}

function renderPage(date) {
  resetEventForm();
  resetContent();
  let { year, month } = getDateInfo(date);
  setCurrentMonthYear(month, year);
  let daysArray = calcDaysArray(month, year);
  renderMonth(year, month, daysArray);
}
function renderEventForm(day) {
  let date = new Date(day.dataset.date);
  let eventForm = document.querySelector('.event');
  day.appendChild(eventForm);
  eventForm.classList.remove('hidden');
  eventForm.querySelector('.event__date').value = `${date.getDate()}`;
  let name = eventForm.querySelector('.event__name');
  let participants = eventForm.querySelector('.event__participants');
  let description = eventForm.querySelector('.event__description');
  let deleteBtn = eventForm.querySelector('.event__form-clear');
  let existingEvent = findEvent(date).event || {
    name : '',
    participants : '',
    description : ''
  };
  name.value = existingEvent.name;
  participants.value = existingEvent.participants;
  description.value = existingEvent.description;
  deleteBtn.disabled = findEvent(date).index === -1;
  eventForm.dataset.date = day.dataset.date;
  calendar.clientWidth - (day.offsetLeft + day.clientWidth) < eventForm.clientWidth ?
    eventForm.classList.add('event--left') :
    eventForm.classList.remove('event--left');
}

function findEvent(date) {
  if (typeof date === 'string') date = new Date(date);
  let events = getEvents();
  let index = events.indexOf(events.find(e => compareDates(new Date(e.date), date)))
  return {
    index,
    event: events[index]
  };
}
function addEvent(info) {
  let events = getEvents();
  events.push(info);
  setEvents(events);
}
function updateEvent(index, info) {
  let events = getEvents();
  events[index] = info;
  setEvents(events);
}
function deleteEvent(index) {
  let events = getEvents();
  events.splice(index, 1);
  setEvents(events);
}
function manageEvent(eventInfo) {
  let eventIndex = findEvent(eventInfo.date).index;
  eventIndex !== -1 ? updateEvent(eventIndex, eventInfo) : addEvent(eventInfo);
  renderPage(curr);
}
function getEvents() {
  return JSON.parse(localStorage.getItem('planner-events')) || [];
}
function setEvents(data) {
  localStorage.setItem('planner-events', JSON.stringify(data));
}

renderPage(curr);

//// event handlers

function clearActiveDay() {
  let activeDay = document.querySelector('.day--active');
  if (activeDay) {
    activeDay.classList.remove('day--active');
  }
}
function setActiveDay(target) {
  target.classList.add('day--active');
}

let body = document.querySelector('body');
body.addEventListener('click', e => {
  if (!e.target.closest('.content')) {
    clearActiveDay();
    resetEventForm();
  }
});

let quickFormToggle = document.querySelector('.quick-event__form-toggle');
quickFormToggle.addEventListener('click', e => {
  let quickForm = document.querySelector('.quick-event__container');
  quickForm.classList.contains('hidden') ?
    quickForm.classList.remove('hidden') :
    quickForm.classList.add('hidden');
});

let quickFormClose = document.querySelector('.quick-event__form-close');
quickFormClose.addEventListener('click', e => {
  let quickForm = document.querySelector('.quick-event__container');
  quickForm.classList.add('hidden');
});

let quickFormConfirm = document.querySelector('.quick-event__form-confirm');
quickFormConfirm.addEventListener('click', e => {
  let rawData = document.querySelector('.quick-event__form-text').value.trim().split(',').map(el => el.trim());
  if (rawData.length < 4 || rawData.some((el, i) => el.length === 0 && i < 4)) return alert('wrong info format!');
  if (rawData[0].split(' ').length < 2) return alert('wrong date format!');
  let day = Number(rawData[0].split(' ')[0]);
  let month = rawData[0].split(' ')[1];
  months.some((el, index) => {
    if (month.slice(0, -1).toLowerCase() === el.slice(0, -1).toLowerCase() ||
        month.slice(0, -1).toLowerCase() === el.toLowerCase()) {
      month = index;
      return true;
    }
  });
  let date = new Date(new Date().getFullYear(), month, day);
  if (Number.isNaN(Date.parse(date))) return alert('errors in date validation!');
  let name = rawData[1];
  let participants = rawData[2];
  let description = rawData.slice(3).join(', ');
  let eventInfo = { date, name, participants, description };
  manageEvent(eventInfo);
});

let dateContainer = document.querySelector('.date-container');
dateContainer.addEventListener('click', e => {
  let isPrev = e.target.classList.contains('prev');
  let isNext = e.target.classList.contains('next');
  if (isPrev || isNext) {
    curr = new Date(curr.getFullYear(), curr.getMonth() - (isPrev ? 1 : -1));
    renderPage(curr);
  } else if (e.target.classList.contains('today')) {
    curr = new Date();
    renderPage(curr);
  }
});

let calendar = document.querySelector('.content');
calendar.addEventListener('click', e => {
  let day = e.target.closest('.day');
  if (day && !e.target.closest('.event')) {
    clearActiveDay();
    setActiveDay(day);
    renderEventForm(day);
  } else if (e.target.closest('.event')) {
    let eventForm = document.querySelector('.event');
    if (e.target.classList.contains('event__form-close')) {
      clearActiveDay();
      resetEventForm();
    } else if (e.target.classList.contains('event__form-confirm')) {
      let date = new Date(eventForm.dataset.date);
      let name = eventForm.querySelector('.event__name').value.trim();
      let participants = eventForm.querySelector('.event__participants').value.trim();
      let description = eventForm.querySelector('.event__description').value.trim();
      let eventInfo = { date, name, participants, description };
      if (!name || !participants || !description) {
        return alert('Заполните все поля!');
      }
      manageEvent(eventInfo);
    } else if (e.target.classList.contains('event__form-clear')) {
      let confirmation = confirm('Do you want do delete this event?');
      if (confirmation) {
        let date = new Date(eventForm.dataset.date);
        let eventIndex = findEvent(date).index;
        deleteEvent(eventIndex);
        renderPage(curr);
      }
    }
  }
});
