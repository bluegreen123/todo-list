const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");
const dateInput = document.getElementById("dateInput");
const addButton = document.getElementById("addButton");
const deleteAllButton = document.getElementById("deleteAllButton");
const todoList = document.getElementById("todoList");
const doneList = document.getElementById("doneList");

window.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;
});

addButton.addEventListener("click", addTask);
deleteAllButton.addEventListener("click", deleteAllTasks);
taskInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") addTask();
});

function addTask() {
  const taskText = taskInput.value.trim();
  const priority = prioritySelect.value;
  const dateValue = dateInput.value;

  if (!taskText) {
    alert("Please write a task name before adding.");
    return;
  }

  if (!dateValue) {
    alert("Please select a date before adding.");
    return;
  }

  const newTaskItem = {
    text: taskText,
    priority: priority,
    date: dateValue,
    done: false,
  };

  renderTask(newTaskItem);

  taskInput.value = "";
  taskInput.focus();
}

function renderTask(taskObj) {
  const li = document.createElement("li");
  li.className = "p-3 rounded space-y-2";

  const topRow = document.createElement("div");
  topRow.className = "flex items-center";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "mr-2";
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      moveToDone(li, taskObj);
    } else {
      moveToTodo(li, taskObj);
    }
  });

  const nameSpan = document.createElement("span");
  nameSpan.className = "taskName";
  nameSpan.textContent = taskObj.text;

  topRow.appendChild(checkbox);
  topRow.appendChild(nameSpan);

  const dateRow = document.createElement("div");
  dateRow.className = "text-sm text-gray-600";
  dateRow.textContent = `(${taskObj.priority} || ${formatDate(taskObj.date)})`;

  const bottomRow = document.createElement("div");
  bottomRow.className = "flex space-x-2";

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className =
    "bg-rose-500 text-white px-3 py-1 rounded hover:bg-rose-600";
  deleteButton.addEventListener("click", () => {
    li.remove();
  });

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.className =
    "edit-btn bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600";
  editButton.addEventListener("click", () => {
    editTask(li, taskObj);
  });

  bottomRow.appendChild(deleteButton);
  bottomRow.appendChild(editButton);

  li.appendChild(topRow);
  li.appendChild(dateRow);
  li.appendChild(bottomRow);

  todoList.appendChild(li);

  updateTaskStyles(li, taskObj);
}

function updateTaskStyles(liElement, taskObj) {
  liElement.classList.remove(
    "bg-red-300",
    "bg-yellow-300",
    "bg-green-300",
    "bg-green-100"
  );

  if (taskObj.done) {
    liElement.classList.add("bg-green-100");
  } else {
    switch (taskObj.priority) {
      case "High":
        liElement.classList.add("bg-red-300");
        break;
      case "Medium":
        liElement.classList.add("bg-yellow-300");
        break;
      case "Low":
      default:
        liElement.classList.add("bg-green-300");
        break;
    }
  }
}

function moveToDone(liElement, taskObj) {
  taskObj.done = true;

  const nameSpan = liElement.querySelector(".taskName");
  if (nameSpan) nameSpan.classList.add("line-through");

  if (todoList.contains(liElement)) {
    todoList.removeChild(liElement);
  }
  doneList.appendChild(liElement);

  const editButton = liElement.querySelector(".edit-btn");
  if (editButton) {
    editButton.remove();
  }
  const checkbox = liElement.querySelector('input[type="checkbox"]');
  checkbox.checked = true;

  updateTaskStyles(liElement, taskObj);
}

function moveToTodo(liElement, taskObj) {
  taskObj.done = false;

  const nameSpan = liElement.querySelector(".taskName");
  if (nameSpan) nameSpan.classList.remove("line-through");

  if (doneList.contains(liElement)) {
    doneList.removeChild(liElement);
  }

  todoList.appendChild(liElement);

  const checkbox = liElement.querySelector('input[type="checkbox"]');
  checkbox.checked = false;

  updateTaskStyles(liElement, taskObj);
}

function deleteAllTasks() {
  todoList.innerHTML = "";
  doneList.innerHTML = "";
}

function editTask(liElement, taskObj) {
  liElement.querySelectorAll("div").forEach((div) => {
    div.style.display = "none";
  });

  const editForm = document.createElement("div");

  editForm.className = "w-full flex flex-col gap-3 mt-2";

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.value = taskObj.text;
  textInput.className = "px-3 py-2 border rounded w-full";

  const prioritySelect = document.createElement("select");
  prioritySelect.className = "px-3 py-2 border rounded w-full";
  ["Low", "Medium", "High"].forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p + " Priority";
    if (p === taskObj.priority) opt.selected = true;
    prioritySelect.appendChild(opt);
  });

  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.value = taskObj.date;
  dateInput.className = "px-3 py-2 border rounded w-full";

  const buttonRow = document.createElement("div");
  buttonRow.className = "flex gap-3";

  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.className =
    "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600";

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.className = "bg-gray-300 px-4 py-2 rounded hover:bg-gray-400";

  buttonRow.appendChild(saveButton);
  buttonRow.appendChild(cancelButton);

  editForm.appendChild(textInput);
  editForm.appendChild(prioritySelect);
  editForm.appendChild(dateInput);
  editForm.appendChild(buttonRow);

  liElement.appendChild(editForm);

  saveButton.addEventListener("click", () => {
    const newText = textInput.value.trim() || taskObj.text;
    taskObj.text = newText;
    taskObj.priority = prioritySelect.value;
    taskObj.date = dateInput.value;

    editForm.remove();

    liElement.querySelectorAll("div").forEach((div) => {
      div.style.display = "";
    });

    const dateRow = liElement.querySelectorAll("div")[1];
    if (dateRow) {
      dateRow.textContent = `(${taskObj.priority} | ${formatDate(
        taskObj.date
      )})`;
    }
    const nameSpan = liElement.querySelector(".taskName");
    if (nameSpan) {
      nameSpan.textContent = taskObj.text;
    }

    updateTaskStyles(liElement, taskObj);
  });

  cancelButton.addEventListener("click", () => {
    editForm.remove();
    liElement.querySelectorAll("div").forEach((div) => {
      div.style.display = "";
    });
  });
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return "";

  return dateObj.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
