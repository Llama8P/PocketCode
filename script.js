let tasks = JSON.parse(localStorage.getItem('kanbanTasks')) || [];
let currentTaskId = null;
let originColumnId = null; // Store the originating column
let placeholder = null; // Placeholder for drop position

document.addEventListener('DOMContentLoaded', function() {
    // Ensure modal is hidden when the page loads
    document.getElementById('task-modal').style.display = 'none';
    
    // Continue with rendering tasks
    renderTasks();
});

function addTask() {
    const taskInput = document.getElementById('task-input');
    if (!taskInput.value.trim()) return;

    const newTask = {
        id: Date.now(),
        title: taskInput.value.trim(),
        description: '',
        date: '',
        time: '',
        stage: 'To Do'
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
}

function renderTasks() {
    document.querySelectorAll('.task-list').forEach(list => list.innerHTML = '');
    tasks.forEach(task => {
        const taskElem = document.createElement('div');
        taskElem.classList.add('task');
        taskElem.textContent = task.title;
        taskElem.setAttribute('draggable', 'true');
        taskElem.setAttribute('data-id', task.id);
        taskElem.ondragstart = drag;
        taskElem.ondragend = dragEnd; // Remove placeholder on drag end
        taskElem.onclick = () => openModal(task.id);
        document.getElementById(`${task.stage.toLowerCase().replace(" ", "")}-list`).appendChild(taskElem);
    });
}

function drag(event) {
    event.dataTransfer.setData('text', event.target.dataset.id);
    originColumnId = event.target.closest('.column').id;

    // Create a placeholder to show drop zone
    placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');
    placeholder.style.height = '50px'; // Adjust as needed for spacing
}

function allowDrop(event) {
    event.preventDefault();
    const taskList = event.target.closest('.task-list');
    const targetColumn = event.target.closest('.column');

    if (taskList && targetColumn && targetColumn.id !== originColumnId) { 
        if (!taskList.contains(placeholder)) {
            taskList.appendChild(placeholder); // Add placeholder only if not already present
        }
    }
}

function dragEnd() {
    // Remove placeholder on drag end if it exists
    if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
    }
}

function drop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text');
    const newStage = event.target.closest('.column').getAttribute('data-stage');

    tasks = tasks.map(task => {
        if (task.id === parseInt(taskId)) {
            task.stage = newStage;
        }
        return task;
    });

    saveTasks();
    renderTasks();

    // Remove placeholder after drop
    if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
    }
}

function openModal(taskId) {
    currentTaskId = taskId;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    document.getElementById('task-title').value = task.title;
    document.getElementById('task-desc').value = task.description;
    document.getElementById('task-date').value = task.date;
    document.getElementById('task-time').value = task.time;
    document.getElementById('task-modal').style.display = 'flex'; // Show modal
}

function closeModal() {
    document.getElementById('task-modal').style.display = 'none'; // Hide modal
    currentTaskId = null;
}

function saveTask() {
    const task = tasks.find(t => t.id === currentTaskId);
    if (task) {
        task.title = document.getElementById('task-title').value;
        task.description = document.getElementById('task-desc').value;
        task.date = document.getElementById('task-date').value;
        task.time = document.getElementById('task-time').value;
        saveTasks();
        renderTasks();
        closeModal();
    }
}

function deleteTask() {
    tasks = tasks.filter(t => t.id !== currentTaskId);
    saveTasks();
    renderTasks();
    closeModal();
}

function saveTasks() {
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
}
