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
import { current } from './utils.js';
import '../css/style.css';

// initial render
renderPage(current);

// event handlers
let body = document.querySelector('body');
let quickFormShowBtn = document.querySelector('.top__event-show');
let quickFormCloseBtn = document.querySelector('.top__event-close');
let quickFormConfirmBtn = document.querySelector('.top__event-confirm');
let search = document.querySelector('.top__search-input');
let dateContainer = document.querySelector('.date');
let calendar = document.querySelector('.content');

body.addEventListener('click', bodyHandler, true);
quickFormShowBtn.addEventListener('click', quickFormShow);
quickFormCloseBtn.addEventListener('click', quickFormClose);
quickFormConfirmBtn.addEventListener('click', quickFormConfirm);
dateContainer.addEventListener('click', dateHandler);
calendar.addEventListener('click', contentHandler);
search.addEventListener('input', searchHandler);
