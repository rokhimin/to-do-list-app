
document.addEventListener("DOMContentLoaded", function () {
    // DOM elements
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const taskCount = document.getElementById("taskCount");
    const clearCompletedBtn = document.getElementById("clearCompletedBtn");
    const filterTabs = document.querySelectorAll(".tabs li");

    // Task array
    let tasks = [];
    let currentFilter = "all";

    // Load tasks from localStorage
    function loadTasks() {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
      }
    }

    // Save tasks to localStorage
    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Add a new task
    function addTask() {
      const taskText = taskInput.value.trim();
      if (taskText === "") return;

      const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
      };

      tasks.push(newTask);
      taskInput.value = "";
      saveTasks();
      renderTasks();
    }

    // Delete a task
    function deleteTask(id) {
      tasks = tasks.filter((task) => task.id !== id);
      saveTasks();
      renderTasks();
    }

    // Toggle task completion
    function toggleCompleted(id) {
      tasks = tasks.map((task) => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });
      saveTasks();
      renderTasks();
    }

    // Clear completed tasks
    function clearCompleted() {
      tasks = tasks.filter((task) => !task.completed);
      saveTasks();
      renderTasks();
    }

    // Filter tasks
    function filterTasks(filter) {
      currentFilter = filter;
      renderTasks();
    }

    // Render tasks
    function renderTasks() {
      // Filter tasks based on current filter
      let filteredTasks = tasks;
      if (currentFilter === "active") {
        filteredTasks = tasks.filter((task) => !task.completed);
      } else if (currentFilter === "completed") {
        filteredTasks = tasks.filter((task) => task.completed);
      }

      // Clear task list
      taskList.innerHTML = "";

      // Update task count
      const activeCount = tasks.filter((task) => !task.completed).length;
      taskCount.textContent = `${activeCount} task${
        activeCount !== 1 ? "s" : ""
      } left`;

      // Show "No tasks" message if there are no tasks
      if (filteredTasks.length === 0) {
        const noTasksMsg = document.createElement("div");
        noTasksMsg.className = "no-tasks";
        noTasksMsg.textContent = "No tasks";
        taskList.appendChild(noTasksMsg);
        return;
      }

      // Render tasks
      filteredTasks.forEach((task) => {
        const taskItem = document.createElement("div");
        taskItem.className = "task-item";
        taskItem.dataset.id = task.id;

        // Safely encode HTML content to prevent XSS
        const safeText = document.createTextNode(task.text).textContent;

        taskItem.innerHTML = `
                    <span class="drag-handle">
                        <i class="fas fa-grip-vertical"></i>
                    </span>
                    <span class="checkbox">
                        <i class="far ${
                          task.completed ? "fa-check-square" : "fa-square"
                        }"></i>
                    </span>
                    <span class="task-text ${
                      task.completed ? "completed" : ""
                    }">${safeText}</span>
                    <button class="button is-small is-danger is-light delete-btn">
                        <span class="icon is-small">
                            <i class="fas fa-trash"></i>
                        </span>
                    </button>
                `;

        // Add event listeners
        taskItem
          .querySelector(".checkbox")
          .addEventListener("click", () => {
            toggleCompleted(task.id);
          });

        taskItem
          .querySelector(".delete-btn")
          .addEventListener("click", () => {
            deleteTask(task.id);
          });

        taskList.appendChild(taskItem);
      });
    }

    // Event listeners
    addTaskBtn.addEventListener("click", addTask);

    taskInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        addTask();
      }
    });

    clearCompletedBtn.addEventListener("click", clearCompleted);

    // Filter tabs
    filterTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        filterTabs.forEach((t) => t.classList.remove("is-active"));
        tab.classList.add("is-active");
        filterTasks(tab.dataset.filter);
      });
    });

    // Load tasks on page load
    loadTasks();
  });