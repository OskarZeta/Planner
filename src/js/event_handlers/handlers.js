import {
  resetEventForm,
  clearSearchResults,
  clearActiveDay,
  setActiveDay,
  showElement,
  hideElement,
  disableElement,
  enableElement,
} from '../render/utils.js';
import {
  renderNewPage,
  renderEventForm,
  renderSearchResults
} from '../render/render.js';
import {
  findEvent,
  manageEvent,
  deleteEvent
} from '../tasks/tasks.js';
import { current } from '../utils.js';
import { months } from '../globals.js';

export function bodyHandler(e) {
  if (!e.target.closest('.content')) {
    clearActiveDay();
    resetEventForm();
  }
  if (!e.target.closest('.top__search')) {
    clearSearchResults();
  }
  if (!e.target.closest('.top__event')) {
    quickFormClose();
  }
}
export function quickFormShow(e) {
  let quickForm = document.querySelector('.top__event-container');
  showElement(quickForm);
  disableElement(e.target);
}
export function quickFormClose() {
  let quickFormText = document.querySelector('.top__event-text');
  quickFormText.value = '';
  let quickForm = document.querySelector('.top__event-container');
  hideElement(quickForm);
  let quickFormShow = document.querySelector('.top__event-show');
  enableElement(quickFormShow);
}
export function quickFormConfirm() {
  let rawData = document.querySelector('.top__event-text').value.trim().split(',').map(el => el.trim());
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
  renderNewPage(date, true);
}
export function dateHandler(e) {
  let isPrev = e.target.classList.contains('date__prev');
  let isNext = e.target.classList.contains('date__next');
  let today = e.target.classList.contains('date__today');
  if (isPrev || isNext) {
    renderNewPage(new Date(current.getFullYear(), current.getMonth() - (isPrev ? 1 : -1)));
  } else if (today) {
    renderNewPage(new Date(), true);
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
        renderNewPage(current);
      }
    }
  }
}
export function searchHandler(e) {
  let searchQuery = e.target.value.trim();
  clearSearchResults();
  renderSearchResults(searchQuery);
}
