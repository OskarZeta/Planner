import { months, week } from './globals.js';
import { renderPage } from './render/render.js';
import {
  bodyHandler,
  quickFormShow,
  quickFormClose,
  quickFormConfirm,
  dateHandler,
  contentHandler,
  searchHandler
} from './event_handlers/handlers.js';
import { current, setDate } from './utils.js';

renderPage(current);

//// event handlers

let body = document.querySelector('body');
let quickFormShowBtn = document.querySelector('.quick-event__form-show');
let quickFormCloseBtn = document.querySelector('.quick-event__form-close');
let quickFormConfirmBtn = document.querySelector('.quick-event__form-confirm');
let dateContainer = document.querySelector('.date-container');
let calendar = document.querySelector('.content');
let search = document.querySelector('.top__search-input');

body.addEventListener('click', bodyHandler, true);
quickFormShowBtn.addEventListener('click', quickFormShow);
quickFormCloseBtn.addEventListener('click', quickFormClose);
quickFormConfirmBtn.addEventListener('click', quickFormConfirm);
dateContainer.addEventListener('click', dateHandler);
calendar.addEventListener('click', contentHandler);
search.addEventListener('input', searchHandler);
