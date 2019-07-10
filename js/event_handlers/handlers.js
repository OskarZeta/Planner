import {
  //getDayOfWeekNumber,
  resetEventForm,
  //clearContent,
  clearSearchResults,
  clearActiveDay,
  setActiveDay,
  //calcDaysArray,
  //calcEventFormOffset,
  //setCurrentMonthYear,
  showElement,
  hideElement,
  disableElement,
  enableElement,
} from '../render/utils.js';
import {
  //renderDay,
  //renderMonth,
  renderPage,
  renderEventForm,
  renderSearchResults
} from '../render/render.js';
import {
  findEvent,
  manageEvent,
  deleteEvent
} from '../tasks/tasks.js';
import { current, setDate } from '../utils.js';
import { months } from '../globals.js';

export function bodyHandler(e) {
  if (!e.target.closest('.content')) {
    clearActiveDay();
    resetEventForm();
  }
  if (!e.target.closest('.top__search')) {
    clearSearchResults();
  }
}
export function quickFormShow(e) {
  let quickForm = document.querySelector('.quick-event__container');
  showElement(quickForm);
  disableElement(e.target);
}
export function quickFormClose(e) {
  let quickForm = document.querySelector('.quick-event__container');
  hideElement(quickForm);
  let quickFormShow = document.querySelector('.quick-event__form-show');
  enableElement(quickFormShow);
}
export function quickFormConfirm(e) {
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
}
export function dateHandler(e) {
  let isPrev = e.target.classList.contains('prev');
  let isNext = e.target.classList.contains('next');
  let today = e.target.classList.contains('today');
  if (isPrev || isNext) {
    setDate(new Date(current.getFullYear(), current.getMonth() - (isPrev ? 1 : -1)));
    renderPage(current);
  } else if (today) {
    setDate(new Date());
    renderPage(current);
    let day = document.querySelector('.day--today');
    day.click();
  }
}
export function contentHandler(e) {
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
        renderPage(current);
      }
    }
  }
}
export function searchHandler(e) {
  let searchQuery = e.target.value.trim();
  clearSearchResults();
  renderSearchResults(searchQuery);
}
