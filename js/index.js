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
  let today = new Date();
  let dayDiv = document.createElement('DIV');
  dayDiv.classList.add('day');
  if (compareDates(today, date)) dayDiv.classList.add('day--active');
  dayDiv.dataset.date = date;
  let span = document.createElement('SPAN');
  span.innerHTML = withDayOfWeek ?
    `${week[getDayOfWeekNumber(date.getDay())]}, ${date.getDate()}` :
    `${date.getDate()}`;
  dayDiv.appendChild(span);
  let activeEvents = JSON.parse(localStorage.getItem('planner-events')) || [];
  let existingEvent = activeEvents.find(e => compareDates(new Date(e.date), date));
  if (existingEvent) {
    let eventContent = document.createElement('DIV');
    eventContent.innerHTML = `
      <div>${existingEvent.name}</div>
      <div>${existingEvent.participants}</div>
      <div>${existingEvent.description}</div>
    `;
    dayDiv.appendChild(eventContent);
  }
  return dayDiv;
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

renderPage(curr);

document.querySelector('MAIN').addEventListener('click', e => {
  if (e.target.classList.contains('prev')) {
    curr = new Date(curr.getFullYear(), curr.getMonth() - 1);
    renderPage(curr);
  }
  if (e.target.classList.contains('next')) {
    curr = new Date(curr.getFullYear(), curr.getMonth() + 1);
    renderPage(curr);
  }
  if (e.target.classList.contains('day')) {
    let dayEl = e.target;
    let calendarEl = document.querySelector('.content');
    let date = new Date(dayEl.dataset.date);
    let eventForm = document.querySelector('.event');
    dayEl.appendChild(eventForm);
    eventForm.classList.remove('hidden');
    eventForm.querySelector('.event__date').value = `${date.getDate()}`;
    eventForm.dataset.date = dayEl.dataset.date;
    if (calendarEl.clientWidth - (dayEl.offsetLeft + dayEl.clientWidth) < eventForm.clientWidth) {
      eventForm.classList.add('event--left');
    } else {
      eventForm.classList.remove('event--left');
    }
  }
  if (e.target.classList.contains('close-form')) {
    resetEventForm();
  }
  if (e.target.classList.contains('confirm-form')) {
    e.preventDefault();
    let date = new Date(document.querySelector('.event').dataset.date);
    let name = document.querySelector('.event__name').value.trim();
    let participants = document.querySelector('.event__participants').value.trim();
    let description = document.querySelector('.event__description').value.trim();
    let eventInfo = { date, name, participants, description };
    if (!name || !participants || !description) {
      return alert('Заполните все поля!');
    }
    let activeEvents = JSON.parse(localStorage.getItem('planner-events')) || [];
    let existingEvent = activeEvents.find(e => compareDates(new Date(e.date), date));
    existingEvent ?
      activeEvents[activeEvents.indexOf(existingEvent)] = eventInfo :
      activeEvents.push(eventInfo);
    localStorage.setItem('planner-events', JSON.stringify(activeEvents));
    renderPage(curr);
  }
});
