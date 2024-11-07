let draggedTask = null;
let currentTaskElement = null;

// Function to add a new task to the specified column
function addTask(columnId) {
  const input = document.getElementById(`${columnId}-input`);
  const taskText = input.value.trim();

  // Ensure the button is selected properly
  const addButton = document.querySelector(`#${columnId} button`);

  // If there is valid input, create a task
  if (taskText) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.textContent = taskText;

    // Create delete icon and add it to the task
    const deleteIcon = document.createElement('span');
    deleteIcon.classList.add('delete-icon');
    deleteIcon.textContent = '🗑';

    // Immediately remove task when delete icon is clicked (without triggering the modal)
    deleteIcon.onclick = () => taskElement.remove();

    taskElement.appendChild(deleteIcon);

    // Make task draggable
    taskElement.setAttribute('draggable', true);

    // Drag start event
    taskElement.addEventListener('dragstart', (e) => {
      draggedTask = taskElement;
      taskElement.style.opacity = '0.5'; // Change opacity during drag
      e.dataTransfer.effectAllowed = 'move';
      setTimeout(() => taskElement.style.display = 'none', 0); // Hide task element temporarily during drag
    });

    // Drag end event
    taskElement.addEventListener('dragend', () => {
      if (draggedTask) {
        draggedTask.style.opacity = '1'; // Reset opacity after drag ends
        draggedTask.style.display = 'flex'; // Make the task visible again after drag
        draggedTask = null;
      }
    });

    // Add click event for opening modal when task itself is clicked
    taskElement.addEventListener('click', (e) => {
      // Prevent the delete icon click from triggering modal
      if (e.target !== deleteIcon) {
        openModal(taskText, taskElement);
      }
    });

    // Append the task to the column's task list
    document.getElementById(`${columnId}-list`).appendChild(taskElement);
    input.value = ''; // Clear input field

    // Disable the button after task is added
    if (addButton) {
      addButton.disabled = true; // Disable the button after adding the task
    }
  } else {
    alert('Please enter a task!');
  }
}

// Function to open modal with task details
function openModal(taskText, taskElement) {
  // Set the task title in the modal
  const modalTitle = document.getElementById('modal-task-title');
  modalTitle.textContent = taskText;

  // Set the task element as the current task being edited
  currentTaskElement = taskElement;

  // Open the modal
  const modal = document.getElementById('task-modal');
  modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById('task-modal');
  modal.style.display = 'none';
}

// Function to save task details
function saveTaskDetails() {
  const taskDetails = document.getElementById('modal-task-details').value.trim();

  // Save details to task element or process as needed
  if (taskDetails) {
    currentTaskElement.setAttribute('data-details', taskDetails); // Save task details in a data attribute (or wherever needed)
    closeModal();
  } else {
    alert('Please add task details!');
  }
}

// Monitor the input field to enable/disable the "Add Task" button
document.addEventListener('DOMContentLoaded', () => {
  const todoInput = document.getElementById('todo-input');
  const todoButton = document.querySelector('#todo-column button');

  if (todoInput && todoButton) {
    todoInput.addEventListener('input', () => {
      // Enable button if there's text in input, disable it otherwise
      todoButton.disabled = !todoInput.value.trim();
    });
  }

  // Set up drag and drop for each column
  const columns = document.querySelectorAll('.kanban-column');
  columns.forEach(column => {
    // Enable drag over for each column to allow dropping
    column.addEventListener('dragover', (e) => {
      e.preventDefault();  // Allow the drop to happen
      column.classList.add('hovered');  // Optional: add a hover effect
    });

    // Remove hover effect when drag leaves
    column.addEventListener('dragleave', () => {
      column.classList.remove('hovered');
    });

    // Handle drop event when a task is dropped
    column.addEventListener('drop', (e) => {
      e.preventDefault();
      column.classList.remove('hovered');

      // Ensure we have a valid dragged task
      if (draggedTask) {
        // Reset opacity before appending
        draggedTask.style.opacity = '1'; // Ensure opacity is reset before appending
        draggedTask.style.display = 'flex'; // Make the task visible again
        // Append the task to the current column
        column.querySelector('.kanban-list').appendChild(draggedTask);
        draggedTask = null;
      }
    });
  });
});
