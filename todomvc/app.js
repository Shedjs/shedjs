import ShedEvent from "../shedjs/events.js";

const todoInput = document.getElementById('todo-input');
const todoListEl = document.querySelector('.todo-list');

let todos = [];

function loadTodos() {
    
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
    }
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function escapeHTML(str) {
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
}

function renderTodos() {
    todoListEl.innerHTML = '';

    const footer = document.createElement('footer');
    todos.forEach(todo => {
        const li = document.createElement('li');

        li.dataset.id = todo.id;
        if (todo.completed) {
            li.classList.add('completed');
        }
        li.innerHTML = `
            <div class="view">
                <input class="toggle" type="checkbox" ${todo.completed ? 'checked' : ''}>
                <label>${escapeHTML(todo.text)}</label>
                <button class="destroy"></button>
            </div>
            <input class="edit" value="${escapeHTML(todo.text)}">
        `;
        todoListEl.appendChild(li);

    });
    footer.innerHTML = `
        <footer class="footer" data-testid="footer">
            <span class="todo-count">
                <strong>${todos.filter(t => !t.completed).length}</strong> item${todos.filter(t => !t.completed).length === 1 ? '' : 's'} left
            </span>
            <ul class="filters" data-testid="footer-navigation">
                <li>
                    <a class="selected" href="#/">All</a>
                </li>
                <li>
                    <a href="#/active">Active</a>
                </li>
                <li>
                    <a href="#/completed">Completed</a>
                </li>
            </ul>
            <button class="clear-completed" disabled>Clear completed</button>
            </footer>
        `;
    todoListEl.appendChild(footer);
    saveTodos();
}

function addTodo(event) {
    if (event.key === 'Enter') {
        const text = todoInput.value.trim();
        if (text === '') {
            return;
        }

        todos.push({
            id: Date.now(),
            text: text,
            completed: false
        });

        todoInput.value = ''; // Clear input
        saveTodos();
        renderTodos();
    }
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    todos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
}

function startEditing(id, liElement) {
    liElement.classList.add('editing');
    const editInput = liElement.querySelector('.edit');
    editInput.focus();
    editInput.setSelectionRange(editInput.value.length, editInput.value.length);
}

function finishEditing(id, liElement, newText) {
    const text = newText.trim();
    liElement.classList.remove('editing');

    if (text === '') {
        deleteTodo(id);
    } else {
        todos = todos.map(todo =>
            todo.id === id ? { ...todo, text: text } : todo
        );
        saveTodos();
        renderTodos();
    }
}

let shedEvent = new ShedEvent()
shedEvent.initEventSystem();

// add event Shedjs
shedEvent.onEvent('keypress', '#todo-input', addTodo);

shedEvent.onEvent('click', '.todo-list', (event) => {
    const target = event.target;
    const li = target.closest('li');
    if (!li) return;

    const todoId = Number(li.dataset.id);

    if (target.classList.contains('destroy')) {
        deleteTodo(todoId);
    } else if (target.classList.contains('toggle')) {
        toggleTodo(todoId);
    }
});

shedEvent.onEvent('dblclick', '.todo-list', event => {
    const target = event.target;
    if (target.tagName === 'LABEL') {
        const li = target.closest('li');
        if (!li) return;
        const todoId = Number(li.dataset.id);
        startEditing(todoId, li);
    }
});

shedEvent.onEvent('blur', '.todo-list', event => {
    const target = event.target;
    if (target.classList.contains('edit')) {
        const li = target.closest('li');
        if (!li) return;
        const todoId = Number(li.dataset.id);
        finishEditing(todoId, li, target.value);
    }
});

shedEvent.onEvent('keyup', '.todo-list', event => {
    const target = event.target;
    if (target.classList.contains('edit')) {
        const li = target.closest('li');
        if (!li) return;
        const todoId = Number(li.dataset.id);

        if (event.key === 'Enter') {
            finishEditing(todoId, li, target.value);
        } else if (event.key === 'Escape') {
            li.classList.remove('editing');
            renderTodos();
        }
    }
});

shedEvent.onEvent('unbeforeunload', '#todo-input', event => {
    if (todoInput.value.trim() !== '') {
       //supprimer localestorage
        localStorage.removeItem('todos');
    }
});

loadTodos();
renderTodos();