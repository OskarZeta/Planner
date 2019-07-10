import {
  getDayOfWeekNumber,
  resetEventForm,
  clearContent,
  //clearSearchResults,
  //clearActiveDay,
  //setActiveDay,
  calcDaysArray,
  calcEventFormOffset,
  setCurrentMonthYear,
  showElement,
  //hideElement,
  //disableElement,
  //enableElement,
} from './utils.js';
import { compareDates, current, setDate } from '../utils.js';
import { findEvent, getEvents } from '../tasks/tasks.js';
import { months, week } from '../globals.js';

export function renderDay(date, withDayOfWeek) {
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
export function renderMonth(year, month, days) {
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
export function renderPage(date) {
  resetEventForm();
  clearContent();
  let year = date.getFullYear();
  let month = date.getMonth();
  setCurrentMonthYear(month, year);
  let daysArray = calcDaysArray(month, year);
  renderMonth(year, month, daysArray);
}
export function renderEventForm(day) {
  let date = new Date(day.dataset.date);
  let eventForm = document.querySelector('.event');
  day.appendChild(eventForm);
  showElement(eventForm);
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
  calcEventFormOffset(day);
}
export function renderSearchResults(searchQuery) {
  let resultsContainer = document.querySelector('.top__search-results');
  let events = getEvents();
  if (!events.length) {
    renderSearchNoResults();
    return;
  }
  let resultsList = document.createElement('UL');
  events.forEach(eventData => {
    if (eventData.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1) {
      let li = document.createElement('LI');
      let date = new Date(eventData.date);
      li.dataset.date = date;
      li.innerHTML = `
        <div>${eventData.name}</div>
        </div>${date.getDate()}.${date.getMonth()}.${date.getFullYear()}</div>
      `;
      resultsList.appendChild(li);
    }
  });
  if (resultsList.children.length) {
    resultsList.addEventListener('click', e => {
      let eventInfo = e.target.closest('LI');
      if (eventInfo) {
        setDate(new Date(eventInfo.dataset.date));
        renderPage(current);
        let day = [...document.querySelectorAll('.day')].find(day => compareDates(new Date(day.dataset.date), current));
        day.click();
      }
    });
    resultsContainer.appendChild(resultsList);
  } else {
    renderSearchNoResults();
  }
}
export function renderSearchNoResults() {
  let resultsContainer = document.querySelector('.top__search-results');
  let div = document.createElement('DIV');
  div.innerHTML = 'no results!';
  resultsContainer.appendChild(div);
}
