window.onload = function () {
  loadTasks();
};

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const deadlineInput = document.getElementById("deadlineInput");
  const task = taskInput.value.trim();
  const deadline = deadlineInput.value;

  if (task === "") {
    alert("Please enter a task!");
    return;
  }

  createTaskElement(task, false, deadline);
  saveTask(task, false, deadline);

  taskInput.value = "";
  deadlineInput.value = "";
}

function createTaskElement(taskText, isCompleted = false, deadline = "") {
  const li = document.createElement("li");
  li.setAttribute("data-completed", isCompleted);
  li.setAttribute("data-deadline", deadline);
  li.textContent = taskText;

  if (isCompleted) {
    li.classList.add("completed");
  }

  // Deadline display
  if (deadline) {
    const deadlineEl = document.createElement("div");
    deadlineEl.className = "deadline";
    deadlineEl.textContent = "📅 Due: " + deadline;
    li.appendChild(deadlineEl);
  }

  // Toggle completed on click
  li.onclick = function (e) {
    if (e.target.tagName === "BUTTON") return;
    li.classList.toggle("completed");
    li.setAttribute("data-completed", li.classList.contains("completed"));
    updateLocalStorage();
    applyFilter(); // Apply filter after toggling
  };

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.onclick = function (e) {
    e.stopPropagation();
    li.remove();
    updateLocalStorage();
  };

  li.appendChild(deleteBtn);
  document.getElementById("taskList").appendChild(li);
}

function saveTask(task, isCompleted, deadline) {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.push({ text: task, completed: isCompleted, deadline: deadline });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.forEach(task => {
    createTaskElement(task.text, task.completed, task.deadline);
  });
}

function updateLocalStorage() {
  const taskElements = document.querySelectorAll("#taskList li");
  const updatedTasks = [];

  taskElements.forEach(li => {
    const text = li.firstChild.textContent;
    const completed = li.classList.contains("completed");
    const deadline = li.getAttribute("data-deadline");
    updatedTasks.push({ text, completed, deadline });
  });

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function clearTasks() {
  if (confirm("Delete all tasks?")) {
    localStorage.removeItem("tasks");
    document.getElementById("taskList").innerHTML = "";
  }
}

function applyFilter() {
  const filter = document.getElementById("filterSelect").value;
  const items = document.querySelectorAll("#taskList li");

  items.forEach(li => {
    const isCompleted = li.classList.contains("completed");

    li.classList.remove("filtered"); // reset

    if (filter === "all") {
      li.style.display = "flex";
    } else if (filter === "completed" && isCompleted) {
      li.style.display = "flex";
      li.classList.add("filtered"); // no strikethrough here
    } else if (filter === "incomplete" && !isCompleted) {
      li.style.display = "flex";
    } else {
      li.style.display = "none";
    }
  });
}
