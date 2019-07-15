import { months, week } from '../globals.js';

export function getDayOfWeekNumber(day) {
  if (day === 0) return 6;
  return day - 1;
}
export function showElement(element) {
  element.classList.remove('hidden');
}
export function hideElement(element) {
  element.classList.add('hidden');
}
export function disableElement(element) {
  element.disabled = true;
}
export function enableElement(element) {
  element.disabled = false;
}
export function resetEventForm() {
  let content = document.querySelector('.content__container');
  let eventForm = document.querySelector('.event');
  if (eventForm) {
    hideElement(eventForm);
    content.appendChild(eventForm);
  }
}
export function clearContent() {
  let calendar = document.querySelector('.content');
  calendar.innerHTML = '';
}
export function clearSearchResults() {
  let resultsContainer = document.querySelector('.top__search-results');
  resultsContainer.innerHTML = '';
}
export function clearActiveDay() {
  let activeDay = document.querySelector('.day--active');
  if (activeDay) {
    activeDay.classList.remove('day--active');
  }
}
export function setActiveDay(target) {
  target.classList.add('day--active');
}
export function calcDaysArray(month, year) {
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
export function calcEventFormOffset(day) {
  let calendar = document.querySelector('.content');
  let eventForm = document.querySelector('.event');
  calendar.clientWidth - (day.offsetLeft + day.clientWidth) < eventForm.clientWidth ?
    eventForm.classList.add('event--left') :
    eventForm.classList.remove('event--left');
}
export function setCurrentMonthYear(month, year) {
  let dateContainer = document.querySelector('.date__current');
  dateContainer.innerHTML = `${months[month]} ${year}`;
}
