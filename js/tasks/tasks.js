import { compareDates } from '../utils.js';
import { renderPage } from '../render/render.js';
import { current, setDate } from '../utils.js';

export function findEvent(date) {
  if (typeof date === 'string') date = new Date(date);
  let events = getEvents();
  let index = events.indexOf(events.find(e => compareDates(new Date(e.date), date)))
  return {
    index,
    event: events[index]
  };
}
export function addEvent(info) {
  let events = getEvents();
  events.push(info);
  setEvents(events);
}
export function updateEvent(index, info) {
  let events = getEvents();
  events[index] = info;
  setEvents(events);
}
export function deleteEvent(index) {
  let events = getEvents();
  events.splice(index, 1);
  setEvents(events);
}
export function manageEvent(eventInfo) {
  let eventIndex = findEvent(eventInfo.date).index;
  eventIndex !== -1 ? updateEvent(eventIndex, eventInfo) : addEvent(eventInfo);
  renderPage(current);
}
export function getEvents() {
  return JSON.parse(localStorage.getItem('planner-events')) || [];
}
export function setEvents(data) {
  localStorage.setItem('planner-events', JSON.stringify(data));
}
