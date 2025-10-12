// Load todos from localStorage at startup
document.addEventListener('DOMContentLoaded', function() {
    var todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(addItem);
});

document.getElementById('add-todo').addEventListener('click', function() {
    var value = document.getElementById('todo-input').value;
    if (value) {
        addItem(value);
        document.getElementById('todo-input').value = '';
        saveTodos();
    }
});

function addItem(text) {
    var list = document.getElementById('todo-list');

    var item = document.createElement('li');
    item.innerText = text;

    var deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete1';
    deleteButton.addEventListener('click', function() {
        list.removeChild(item);
        saveTodos();
    });

    item.appendChild(deleteButton);

    list.appendChild(item);
}

function saveTodos() {
    var todos = Array.from(document.getElementById('todo-list').children).map(function(item) {
        return item.innerText.replace('Delete1', '');
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}