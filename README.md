1. Install Tailwind CSS using CLI:

   ```bash
   npm install tailwindcss @tailwindcss/cli
   ```

2. Create a file named `input.css` in the `src` folder and add the following code:

   ```css
   @import "tailwindcss";
   ```

3. Run the following command to generate the `output.css` file:

   ```bash
   npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch
   ```

4. Make a folder named `todo-app`.

5. Inside `todo-app`, create the following files:
   - `index.html`
   - `app.js`
   - `input.css`

   Structure:

   ```
   todo-app
   ├─ src
   │  ├─ index.html
   │  ├─ app.js
   │  ├─ input.css
   │  └─ output.css
   ├─ package.json
   ├─ node_modules
   └─ package-lock.json
   ```

6. Create a file named `index.html` in the `todo-app` folder and add the following code:

   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <title>Todo App</title>
       <link href="./output.css" rel="stylesheet" />
     </head>
     <body class="bg-gray-50 min-h-screen">
       <div class="container mx-auto p-4">
         <h1 class="text-3xl font-bold text-center mb-6">Enhanced To-Do App</h1>


         <div class="bg-white p-6 rounded shadow-md mb-6 max-w-2xl mx-auto">
           <h2 class="text-xl font-semibold mb-4">Add New Task</h2>


           <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">

             <input
               id="taskInput"
               type="text"
               placeholder="Task name..."
               class="px-3 py-2 border rounded focus:outline-none"
             />

             <select
               id="prioritySelect"
               class="px-3 py-2 border rounded focus:outline-none"
             >
               <option value="Low">Low Priority</option>
               <option value="Medium">Medium Priority</option>
               <option value="High">High Priority</option>
             </select>

             <input
               id="dateInput"
               type="date"
               class="px-3 py-2 border rounded focus:outline-none"
             />
           </div>


           <div class="flex justify-center">

             <button
               id="addButton"
               class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
             >
               Add
             </button>
           </div>
         </div>


         <div class="flex justify-center mb-6">
           <button
             id="deleteAllButton"
             class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
           >
             Delete All Tasks
           </button>
         </div>


         <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

           <div class="bg-white p-6 rounded shadow-md">
             <h2 class="text-xl font-semibold mb-4">Tasks To Do</h2>
             <ul id="todoList" class="space-y-2">

             </ul>
           </div>


           <div class="bg-white p-6 rounded shadow-md">
             <h2 class="text-xl font-semibold mb-4">Tasks Done</h2>
             <ul id="doneList" class="space-y-2">

             </ul>
           </div>
         </div>
       </div>


       <script src="app.js"></script>
     </body>
   </html>
   ```

7. Create a file named `app.js` in the `src` folder and add the following code:

  ```javascript
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
  ```

Final Check:
- Ensure your `app.js` file contains all the functions: `addTask`, `renderTask`, `updateTaskStyles`, `moveToDone`, `moveToTodo`, `deleteAllTasks`, `editTask`, and `formatDate`.
- Verify that your code references the IDs from `index.html` (e.g., `taskInput`, `prioritySelect`).
- Test the application by opening `index.html` in a browser.

