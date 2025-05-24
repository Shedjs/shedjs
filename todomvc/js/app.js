import Dom from "/shedjs/dom.js";
import Event from "/shedjs/events.js";

const todoInput = document.getElementById('todo-input');
const todoListEl = document.querySelector('.todo-list');

let todos = [];
let currentFilter = 'all';
let shedEvent = new Event();

function loadTodos() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) todos = JSON.parse(storedTodos);
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function escapeHTML(str) {
    const p = Dom.createElement('p');
    Dom.appendChild(p, Dom.createTextNode(str));
    return p.innerHTML;
}

function renderTodos(filter = 'all') {
    currentFilter = filter;
    todoListEl.innerHTML = '';

    // Filter todos based on the selected filter
    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    const footer = Dom.createElement('footer');
    const div = Dom.createElement('div');
    div.classList.add("toggle-all-container");

    // Only render the toggle-all checkbox if there are todos
    if (todos.length > 0) {
        div.innerHTML = `
            <input class="toggle-all" type="checkbox" 
                   ${todos.every(t => t.completed) ? 'checked' : ''} 
                   id="toggle-all" data-testid="toggle-all">
            <label for="toggle-all">Mark all as complete</label>
        `;
        Dom.appendChild(todoListEl, div);
    }

    // this condition for delete the footer when no tasks yet
    if (filter === 'all' && filteredTodos.length === 0) return

    // this condition for display a message when no tasks active 
    if (filter === 'active' && filteredTodos.length === 0) {
        const emptyMessage = Dom.createElement('div');
        emptyMessage.classList.add('empty-message');
        emptyMessage.textContent = 'No active tasks found!';
        Dom.appendChild(todoListEl, emptyMessage);
    }

    // this condition for display a message when no tasks completed yet
    if (filter === 'completed' && filteredTodos.length === 0) {
        const emptyMessage = Dom.createElement('div');
        emptyMessage.classList.add('empty-message');
        emptyMessage.textContent = 'No completed tasks yet!';
        Dom.appendChild(todoListEl, emptyMessage);
    } else {
        // Render the filtered todos
        filteredTodos.forEach(todo => {
            const li = Dom.createElement('li');
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

            Dom.appendChild(todoListEl, li);
        });
    }

    // Render footer
    footer.innerHTML = `
        <span class="todo-count">
            <strong>${todos.filter(t => !t.completed).length}</strong> 
            item${todos.filter(t => !t.completed).length === 1 ? '' : 's'} left
        </span>
        <ul class="filters" data-testid="footer-navigation">
            <li>
                <a class="${filter === 'all' ? 'selected' : ''}" href="#/">All</a>
            </li>
            <li>
                <a class="${filter === 'active' ? 'selected' : ''}" href="#/active">Active</a>
            </li>
            <li>
                <a class="${filter === 'completed' ? 'selected' : ''}" href="#/completed">Completed</a>
            </li>
        </ul>
        <button class="clear-completed" ${todos.some(t => t.completed) ? '' : 'disabled'}>
            Clear completed
        </button>
    `;

    footer.classList.add("footer");
    Dom.appendChild(todoListEl, footer);
}

function addTodo(event) {
    if (event.key === 'Enter') {
        const text = todoInput.value.trim();
        if (text === '') return;

        todos.push({
            id: Date.now(),
            text: text,
            completed: false
        });

        todoInput.value = '';
        saveTodos();
        renderTodos(currentFilter);
    }
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos(currentFilter);
}

function toggleTodo(id) {
    todos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos(currentFilter);
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
        renderTodos(currentFilter);
    }
}

// Handle initial filter from URL hash
function handleInitialFilter() {
    const hash = window.location.hash.substring(1);
    let filter = 'all';

    if (hash === '/active') filter = 'active';
    else if (hash === '/completed') filter = 'completed';
    else if (hash === '/' || hash === '') filter = 'all';

    renderTodos(filter);
}

// add event Shedjs
shedEvent.onEvent('keypress', '#todo-input', addTodo);

shedEvent.onEvent('click', '.filters a', (event) => {
    event.preventDefault();
    const target = event.target;

    // Get the filter type from href 
    const href = target.getAttribute('href');
    let filter = 'all';

    if (href === '#/active') filter = 'active';
    else if (href === '#/completed') filter = 'completed';
    else if (href === '#/') filter = 'all';

    // Update URL and re-render
    window.location.hash = href.substring(1); // Remove the # for hash
    renderTodos(filter);
});

shedEvent.onEvent('click', '.todo-list', (event) => {
    const target = event.target;

    if (target.classList.contains('toggle-all') && target.type === 'checkbox') {
        const markAsCompleted = target.checked;
        todos = todos.map(todo => ({ ...todo, completed: markAsCompleted }));
        saveTodos();
        renderTodos(currentFilter);
        return;
    }

    const li = target.closest('li');
    if (li) {
        const todoId = Number(li.dataset.id);
        if (target.classList.contains('destroy')) {
            deleteTodo(todoId);
        } else if (target.classList.contains('toggle') && target.type === 'checkbox') {
            toggleTodo(todoId);
        }
        return;
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
            renderTodos(currentFilter);
        }
    }
});

loadTodos();
handleInitialFilter();

// Handle hash changes
shedEvent.onEvent('hashchange', window, () => {
    handleInitialFilter();
});

shedEvent.onEvent('click', '.clear-completed', () => {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos(currentFilter);
});
