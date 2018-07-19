var addBtn = document.querySelector('.submit');
var clearBtn = document.querySelector('.list-clear');
var allLists = JSON.parse(localStorage.getItem('all')) || [];
var list = document.querySelector('.list');
var empty = document.querySelector('.empty-list');
var dayNumber;

function addToList() {
    var text = document.querySelector('.text-input');
    if (text.value.trim() == '') {
        alert("The task can't be empty.");
        return;
    }
    empty.classList.add('hidden');
    var content = text.value.trim();
    list.appendChild(renderElement(content));
    text.value = '';
    allLists[dayNumber-1][2].push(content);
    localStorage.setItem('all', JSON.stringify(allLists));
}

function editElement() {
    var editContainer = document.createElement('div');
    var listElement = this.parentNode.parentNode;
    editContainer.classList.add('edit-container');
    editContainer.innerHTML =
        '<textarea class="edit-field"></textarea>'+
        '<div class="edit-buttons">'+
            '<button class="ok">ok</button>'+
            '<button class="cancel">cancel</button>'+
        '</div>';
    var editField = editContainer.querySelector('.edit-field');
    editField.style.height = parseInt(window.getComputedStyle(listElement).getPropertyValue('height')) + 50 +'px';
    listElement.appendChild(editContainer);
    listElement.style.marginBottom =
        parseInt(window.getComputedStyle(editContainer).getPropertyValue('height')) -
        parseInt(window.getComputedStyle(listElement).getPropertyValue('height')) + 'px';
    var index;
    for (var i = 1; i < list.children.length; i++) {
        if (list.children[i] == this.parentNode.parentNode){
            index = i;
        }
    }
    editField.textContent = allLists[dayNumber-1][2][index-1];
    function editConfirm() {
        allLists[dayNumber-1][2][index-1] = editField.value;
        list.replaceChild(renderElement(editField.value), listElement);
        localStorage.setItem('all', JSON.stringify(allLists));
        this.removeEventListener('click', editConfirm);
        this.parentNode.querySelector('.cancel').removeEventListener('click', editCancel);
    }
    function editCancel() {
        listElement.removeChild(editContainer);
        listElement.style.marginBottom = 0;
        this.removeEventListener('click', editCancel);
        this.parentNode.querySelector('.ok').removeEventListener('click', editConfirm);
    }
    editContainer.querySelector('.ok').addEventListener('click', editConfirm);
    editContainer.querySelector('.cancel').addEventListener('click', editCancel);
}

function removeFromList() {
    if (allLists[dayNumber-1][2].length < 2) {
        empty.classList.remove('hidden');
        allLists[dayNumber-1][2] = [];
    }
    var index;
    for (var i = 1; i < list.children.length; i++) {
        if (list.children[i] == this.parentNode.parentNode) {
            index = i;
        }
    }
    list.removeChild(this.parentNode.parentNode);
    this.removeEventListener('click', removeFromList);
    allLists[dayNumber-1][2].splice(index-1, 1);
    localStorage.setItem('all', JSON.stringify(allLists));
}

function loadList() {
    dayNumber = window.location.href.split('?')[1].split('=')[1];
    var header = document.querySelector('.header');
    header.textContent = allLists[dayNumber-1][0] + ' of ' + allLists[dayNumber-1][1];
    if (allLists[dayNumber-1][2] == undefined) {
        allLists[dayNumber-1][2] = [];
        empty.classList.remove('hidden');
        return;
    } else if ((allLists[dayNumber-1][2] == '')) {
        empty.classList.remove('hidden');
        return;
    } else {
        empty.classList.add('hidden');
    }
    allLists[dayNumber-1][2].forEach(function (elem) {
        list.appendChild(renderElement(elem));
    });
}

function renderElement(content) {
    var item = document.createElement('li');
    item.classList.add('list-item');
    item.innerHTML =
        '<div class="buttons-container">'+
            '<button class="edit">edit</button>'+
            '<button class="remove"></button>'+
        '</div>'+
        '<span class="item-text"></span>';
    var removeBtn = item.querySelector('.remove');
    removeBtn.addEventListener('click', removeFromList);
    var editBtn = item.querySelector('.edit');
    editBtn.addEventListener('click', editElement);
    item.querySelector('.item-text').textContent = content;
    return item;
}

function clearList() {
    var elements = document.querySelectorAll('.list-item');
    for (var i = 0; i < elements.length; i++){
        if (elements[i].classList[1] !== 'empty-list') {
            elements[i].remove();
        } else {
            empty.classList.remove('hidden');
        }
    }
    allLists[dayNumber-1][2] = [];
    localStorage.setItem('all', JSON.stringify(allLists));
}

window.addEventListener('load', loadList);
addBtn.addEventListener('click', addToList);
clearBtn.addEventListener('click', clearList);
clearBtn.addEventListener('mouseover', function () {
    document.querySelector('.header').classList.add('red-bg');
    document.querySelector('.list-buttons').classList.add('red-bg');
});
clearBtn.addEventListener('mouseout', function () {
    document.querySelector('.header').classList.remove('red-bg');
    document.querySelector('.list-buttons').classList.remove('red-bg');
});