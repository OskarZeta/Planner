export function compareDates(date1, date2) {
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

export let current = new Date();

export function setDate(date) {
  current = date;
}
