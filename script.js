(function () {
    // --- GET DOM ELEMENTS ---
    const todoInput = document.getElementById("todo-input");
    const addButton = document.getElementById("add-todo");
    const todoList = document.getElementById("todo-list");

    // --- LOAD TASKS FROM LOCALSTORAGE ---
    // Each task object: { text: string, done: boolean }
    function loadTodos() {
        try {
            const stored = localStorage.getItem("todos");
            if (!stored) return [];
            const parsed = JSON.parse(stored);
            // Handle old format (array of strings) gracefully
            if (
                Array.isArray(parsed) &&
                parsed.length > 0 &&
                typeof parsed[0] === "string"
            ) {
                return parsed.map((text) => ({ text, done: false }));
            }
            // New format: array of objects
            if (Array.isArray(parsed)) {
                return parsed
                    .filter((item) => item && typeof item.text === "string")
                    .map((item) => ({ text: item.text, done: !!item.done }));
            }
            return [];
        } catch (e) {
            console.warn("Failed to load todos", e);
            return [];
        }
    }

    // --- SAVE TASKS TO LOCALSTORAGE ---
    function saveTodos() {
        const items = [];
        const listItems = todoList.querySelectorAll("li");
        listItems.forEach((li) => {
            // Extract text: we need to remove the delete button text.
            // Better: use a data attribute, but we can clone and remove button.
            const clone = li.cloneNode(true);
            const btn = clone.querySelector("button");
            if (btn) btn.remove();
            const text = clone.innerText.trim();
            // Check 'done' class
            const isDone = li.classList.contains("done");
            items.push({ text, done: isDone });
        });
        localStorage.setItem("todos", JSON.stringify(items));
    }

    // --- RENDER A SINGLE TASK (with done state) ---
    function createTaskElement(taskText, isDone = false) {
        const li = document.createElement("li");
        li.innerText = taskText; // set text first
        if (isDone) {
            li.classList.add("done");
        }

        // Create delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        // Prevent event bubbling so clicking delete doesn't toggle done
        deleteBtn.addEventListener("click", function (e) {
            e.stopPropagation(); // <-- important: stop toggle
            li.remove();
            saveTodos();
        });

        li.appendChild(deleteBtn);

        // Toggle done state on click (but not when clicking the delete button)
        li.addEventListener("click", function (e) {
            // if the click target is the delete button or inside it, skip
            if (e.target.tagName === "BUTTON" || e.target.closest("button")) return;
            li.classList.toggle("done");
            saveTodos();
        });

        return li;
    }

    // --- ADD A NEW TASK TO THE LIST (and save) ---
    function addTask(text, isDone = false, skipSave = false) {
        const trimmed = text.trim();
        if (trimmed === "") return;

        const taskEl = createTaskElement(trimmed, isDone);
        todoList.appendChild(taskEl);

        if (!skipSave) {
            saveTodos();
        }
    }

    // --- INITIAL RENDER FROM LOCALSTORAGE ---
    function renderAllTasks() {
        const tasks = loadTodos();
        todoList.innerHTML = ""; // clear
        tasks.forEach((task) => {
            const taskEl = createTaskElement(task.text, task.done);
            todoList.appendChild(taskEl);
        });
    }

    // --- ADD TASK VIA BUTTON / ENTER KEY ---
    function handleAddTask() {
        const text = todoInput.value.trim();
        if (text === "") return;
        addTask(text, false, false); // save inside addTask
        todoInput.value = "";
        todoInput.focus();
    }

    // --- EVENT LISTENERS ---
    addButton.addEventListener("click", handleAddTask);

    todoInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTask();
        }
    });

    // --- INITIALIZE ---
    renderAllTasks();

    // optional: if you want to re-save on page unload (not necessary, but fine)
    // window.addEventListener('beforeunload', saveTodos);
})();

