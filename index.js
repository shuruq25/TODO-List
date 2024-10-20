// Wait for the DOM to load before running the script
document.addEventListener("DOMContentLoaded", () => {
  // Load tasks from localStorage if available
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (storedTasks) {
    storedTasks.forEach((task) => tasks.push(task));
    updateTasksList();
    updateStats();
  }
});

const tasks = [];
let isEditing = false;
let editingIndex = null;

// Save tasks to localStorage
const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Add a new task
const addTask = () => {
  const taskInput = document.getElementById("taskInput");
  const prioritySelect = document.getElementById("prioritySelect");
  const text = taskInput.value.trim();
  const priority = prioritySelect.value;
  if (text) {
    if (isEditing) {
      // Edit the existing task
      tasks[editingIndex].text = text;
      tasks[editingIndex].priority = priority;
      isEditing = false;
      editingIndex = null;
    } else {
      // Add a new task
      tasks.push({ text: text, completed: false, priority: priority });
    }
    taskInput.value = "";
    updateTasksList();
    updateStats();
    saveTasks();
  }
};

// Toggle task completion (check/uncheck)
const toggleTaskComplete = (index) => {
  tasks[index].completed = !tasks[index].completed;
  updateTasksList();
  updateStats();
  saveTasks();
};

// Delete a task
const deleteTask = (index) => {
  tasks.splice(index, 1);
  updateTasksList();
  updateStats();
  saveTasks();
};

// Edit a task
const editTask = (index) => {
  const taskInput = document.getElementById("taskInput");
  const prioritySelect = document.getElementById("prioritySelect");
  taskInput.value = tasks[index].text;
  prioritySelect.value = tasks[index].priority; 
  tasks.splice(index, 1);
  updateTasksList();
  updateStats();
  saveTasks();
};
// Update task stats (completed/total)
const updateStats = () => {
  const completeTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completeTasks / totalTasks) * 100 : 0;

  const progressBar = document.getElementById("progress");
  progressBar.style.width = `${progress}%`;

  document.getElementById("numbers").innerText = `${completeTasks} / ${totalTasks}`;

  // Show confetti if all tasks are completed
  if (totalTasks > 0 && completeTasks === totalTasks) {
    blaskConfetti();
  }
};

// Update the task list in the UI
const updateTasksList = () => {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const listItem = document.createElement("li");

    // Assign a class based on the task's priority
    const priorityClass = task.priority;

    listItem.innerHTML = `
      <div class="taskItem">
        <div class="task ${task.completed ? "completed" : ""}">
          <input type="checkbox" class="checkbox" ${
            task.completed ? "checked" : ""
          } />
          <p>${task.text}</p>
        </div>
        <div class="icons">
          <span class="priority-circle ${priorityClass}"></span>
          <img src="images/write.png" alt="Edit" onClick="editTask(${index})" />
          <img src="images/delete.png" alt="Delete" onClick="deleteTask(${index})" />
        </div>
      </div>
    `;

    // Toggle task completion when checkbox changes
    listItem
      .querySelector(".checkbox")
      .addEventListener("change", () => toggleTaskComplete(index));

    taskList.appendChild(listItem);
  });
};

// Add task when button is clicked
document.getElementById("newTask").addEventListener("click", function (e) {
  e.preventDefault();
  addTask();
});

// Show confetti when all tasks are completed
const blaskConfetti = () => {
  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ["star"],
    colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
  };

  async function shoot() {
    await confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ["star"],
    });

    await confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ["circle"],
    });
  }

  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
};
