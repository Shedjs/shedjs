import Dom from "/shedjs/dom.js";
import Event from "/shedjs/events.js";
import Route from "/shedjs/routes.js"; // Not used yet!
import State from "/shedjs/state.js";

const todoInput = document.getElementById('todo-input');
const todoListEl = document.querySelector('.todo-list');

let shedEvent = new Event()

let initialTodos = [];
const appState = new State({
    todos: initialTodos,
    currentFilter: 'all'
});

console.log("AppState:", appState);

function escapeHTML(str) {
    const p = Dom.createElement('p');
    Dom.appendChild(p, Dom.createTextNode(str));
    return p.innerHTML;
}

function renderTodos() {
    const { todos, currentFilter } = appState.getState();
    // console.log('Appstaating with getstate:', appState.getState());
    todoListEl.innerHTML = '';

    // Filter todos based on the selected filter
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });

    const footer = Dom.createElement('footer');
    const div = Dom.createElement('div');
    div.classList.add("toggle-all-container");

    // Only render the toggle-all checkbox if there are todos
    if (todos.length > 0) {
        div.innerHTML = `
            <input class="toggle-all" type="checkbox" data-testid="toggle-all"
                   ${todos.every(t => t.completed) ? 'checked' : ''} 
                   id="toggle-all" data-testid="toggle-all">
            <label for="toggle-all">Mark all as complete</label>
        `;
        Dom.appendChild(todoListEl, div);
    }


    // this condition for delete the footer when no tasks yet
    // Show footer if there are any todos, even if all are completed/active
    if (currentFilter === 'all' && filteredTodos.length === 0 && todos.length === 0) return

    // this condition for display a message when no tasks active 
    if (currentFilter === 'active' && filteredTodos.length === 0 && todos.length > 0) {
        const emptyMessage = Dom.createElement('div');
        emptyMessage.classList.add('empty-message');
        emptyMessage.textContent = 'No active tasks found!';
        Dom.appendChild(todoListEl, emptyMessage);
    }

    if (currentFilter === 'completed' && filteredTodos.length === 0 && todos.length > 0) {
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
                <a class="${currentFilter === 'all' ? 'selected' : ''}" href="#/">All</a>
            </li>
            <li>
                <a class="${currentFilter === 'active' ? 'selected' : ''}" href="#/active">Active</a>
            </li>
            <li>
                <a class="${currentFilter === 'completed' ? 'selected' : ''}" href="#/completed">Completed</a>
            </li>
        </ul>
        <button class="clear-completed" ${todos.some(t => t.completed) ? '' : 'disabled'}>
            Clear completed
        </button>
    `;

    footer.classList.add("footer");
    Dom.appendChild(todoListEl, footer);
}

function addTodo(e) {
    if (e.key === 'Enter') {
        const text = todoInput.value.trim();
        if (text === '') return;

        const currentTodos = appState.getState().todos;
        const newTodos = [
            ...currentTodos,
            { id: Date.now(), text: text, completed: false }
        ];
        appState.setState({ todos: newTodos });

        todoInput.value = '';
    }
}

function deleteTodo(id) {
    const currentTodos = appState.getState().todos;
    const updatedTodos = currentTodos.filter(todo => todo.id !== id);
    appState.setState({ todos: updatedTodos });
}

function toggleTodo(id) {
    const currentTodos = appState.getState().todos;
    const updatedTodos = currentTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    appState.setState({ todos: updatedTodos });
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
        const currentTodos = appState.getState().todos;
        const updatedTodos = currentTodos.map(todo =>
            todo.id === id ? { ...todo, text: text } : todo
        );
        appState.setState({ todos: updatedTodos });
    }
}

// Handle initial filter from URL hash
function handleInitialFilter() {
    const hash = window.location.hash.substring(1);
    let newFilter = 'all';

    if (hash === '/active' || hash === 'active') newFilter = 'active';
    else if (hash === '/completed' || hash === 'completed') newFilter = 'completed';
    else if (hash === '/' || hash === '') newFilter = 'all';

    if (appState.getState().currentFilter !== newFilter) {
        appState.setState({ currentFilter: newFilter });
    }
}

// add event Shedjs
shedEvent.onEvent('keypress', '#todo-input', addTodo);

shedEvent.onEvent('click', '.filters a', (e) => {
    e.preventDefault();
    const target = e.target;
    const href = target.getAttribute('href');
    window.location.hash = href.substring(1);
});

shedEvent.onEvent('click', '.todo-list', (e) => {
    const target = e.target;

    if (target.classList.contains('toggle-all') && target.type === 'checkbox') {
        const currentTodos = appState.getState().todos;
        const markAsCompleted = target.checked;
        const updatedTodos = currentTodos.map(todo => ({ ...todo, completed: markAsCompleted }));
        appState.setState({ todos: updatedTodos });
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

shedEvent.onEvent('dblclick', '.todo-list', (e) => {
    const target = e.target;
    if (target.tagName === 'LABEL') {
        const li = target.closest('li');
        if (!li) return;
        const todoId = Number(li.dataset.id);
        startEditing(todoId, li);
    }
});

shedEvent.onEvent('blur', '.edit', (e) => {
    console.log('Bluriing');
    const target = e.target;
    const editInput = target.closest('.edit');
    const li = editInput.closest('li');
    if (!li || !editInput) return;

    if (li && li.classList.contains('editing')) {
        const todoId = Number(li.dataset.id);
        renderTodos();
    }
});

shedEvent.onEvent('keyup', '.todo-list', e => {
    const target = e.target;
    if (target.classList.contains('edit')) {
        const li = target.closest('li');
        if (!li) return;
        const todoId = Number(li.dataset.id);

        if (e.key === 'Enter') {
            finishEditing(todoId, li, target.value);
        } else if (e.key === 'Escape') {
            li.classList.remove('editing');
            renderTodos();
        }
    }
});

// Handle hash changes
shedEvent.onEvent('hashchange', 'window', () => {
    handleInitialFilter();
});

shedEvent.onEvent('click', '.clear-completed', () => {
    const currentTodos = appState.getState().todos;
    const updatedTodos = currentTodos.filter(todo => !todo.completed);
    appState.setState({ todos: updatedTodos });
});

appState.subscribe(renderTodos);

handleInitialFilter();
renderTodos();
