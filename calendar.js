var startOffset = 0;
var endOffset;
var counter = 1;

function setCurrentYear() {
    var header = document.querySelector('.current-year');
    header.innerHTML = '' + new Date().getFullYear();
}

setCurrentYear();

function monthFill(monthLength, monthNumber) {
    var month = document.querySelectorAll('.month')[monthNumber];
    for (var i = 1; i < monthLength + 1; i++) {
        var day = document.createElement("a");
        day.href = 'todo-list.html?dayNumber=' + counter + '';
        day.textContent = '' + i + '';
        month.querySelector('.days').appendChild(day);
        counter++;
    }
    var days = month.querySelector('.days');
    var dayWidth = parseInt(window.getComputedStyle(day).getPropertyValue('width'));
    var monthWidth = Math.round(parseFloat(window.getComputedStyle(days).getPropertyValue('width')));

    if (monthNumber == 0) {
        var currentYear = new Date(new Date().getFullYear(), 0, 1);
        var multiplier = currentYear.getDay();
        if (multiplier === 0) {
            multiplier = 7;
        }
        startOffset = (dayWidth * (multiplier - 1));
    }

    days.firstElementChild.style.marginLeft = startOffset;
    endOffset = monthWidth - days.lastElementChild.offsetLeft - dayWidth;
    startOffset = monthWidth - endOffset;
    if (startOffset > monthWidth - dayWidth) {
        startOffset = 0;
    }
    for (var j = 0; j < days.children.length; j++) {
        if (days.children[j].offsetLeft >= monthWidth - (dayWidth * 2.5)) {
            days.children[j].style.color = 'red';
        }
    }
}
function setCalendar () {
    for (var i = 0; i < 12; i++) {
        if (i + 1 <= 7 ) {
            if (i + 1 === 2 && new Date().getFullYear() % 4 !== 0) {
                monthFill(28, i);
                continue;
            }
            if (i + 1 === 2 && new Date().getFullYear() % 4 === 0) {
                monthFill(29, i);
                continue;
            }
            if ((i + 1) % 2 !== 0) {
                monthFill(31, i);
            } else {
                monthFill(30, i);
            }
        } else {
            if ((i + 1) % 2 === 0) {
                monthFill(31, i);
            } else {
                monthFill(30, i);
            }
        }
    }
}

setCalendar();

function setDayInfo() {
    var storagedDays = JSON.parse(localStorage.getItem('all')) || [];
    var calendarDays = document.querySelectorAll('.month a');
    calendarDays.forEach(function(item ,i) {
        if (!storagedDays[i]){
            storagedDays[i] = [];
            storagedDays[i][0] = item.textContent;
            storagedDays[i][1] = item.parentNode.parentNode.querySelector('.month-name').textContent;
            localStorage.setItem('all', JSON.stringify(storagedDays));
        }
        if (storagedDays[i][2] !== undefined && storagedDays[i][2].length > 0) {
            calendarDays[i].classList.add('non-empty');
        }
    });
}

setDayInfo();