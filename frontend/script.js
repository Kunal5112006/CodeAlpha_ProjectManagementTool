const API_URL = "http://localhost:5000/api";

let selectedProjectId = null;
let selectedProjectElement = null;

function showToast(message) {
    const toast = document.getElementById("toast");

    if (!toast) {
        alert(message);
        return;
    }

    toast.innerText = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function getToken() {
    return localStorage.getItem("taskflow_token");
}

function getHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    };
}

/* Register */
async function registerUser() {
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

    if (!name || !email || !password) {
        alert("Please fill all registration fields");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Registration failed");
            return;
        }

        alert("Registration successful. Please login now.");

        document.getElementById("registerName").value = "";
        document.getElementById("registerEmail").value = "";
        document.getElementById("registerPassword").value = "";

    } catch (error) {
        alert("Backend not connected. Run backend using npm run dev");
    }
}

/* Login */
async function loginUser() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Login failed");
            return;
        }

        localStorage.setItem("taskflow_token", data.token);
        localStorage.setItem("taskflow_user", JSON.stringify(data.user));

        window.location.href = "dashboard.html";

    } catch (error) {
        alert("Backend not connected. Run backend using npm run dev");
    }
}

/* Logout */
function logoutUser() {
    localStorage.removeItem("taskflow_token");
    localStorage.removeItem("taskflow_user");
    window.location.href = "index.html";
}

/* Dashboard Load */
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("dashboard.html")) {
        const token = getToken();

        if (!token) {
            window.location.href = "index.html";
            return;
        }

        const user = JSON.parse(localStorage.getItem("taskflow_user"));
        document.getElementById("userName").innerText = user.name;

        loadProjects();
    }
});

/* Create Project */
async function createProject() {
    const title = document.getElementById("projectTitle").value.trim();
    const description = document.getElementById("projectDescription").value.trim();

    if (!title || !description) {
        showToast("Please enter project title and description");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/projects`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ title, description })
        });

        const data = await response.json();

        if (!response.ok) {
            showToast(data.message || "Project creation failed");
            return;
        }

        document.getElementById("projectTitle").value = "";
        document.getElementById("projectDescription").value = "";

        showToast("✅ Project created");
        loadProjects();

    } catch (error) {
        showToast("Backend connection failed");
    }
}

/* Load Projects */
async function loadProjects() {
    try {
        const response = await fetch(`${API_URL}/projects`, {
            headers: getHeaders()
        });

        const projects = await response.json();
        const list = document.getElementById("projectsList");

        list.innerHTML = "";

        if (!Array.isArray(projects) || projects.length === 0) {
            list.innerHTML = "<p>No projects found.</p>";
            return;
        }

        projects.forEach(project => {
            const item = document.createElement("div");
            item.className = "project-item";

            item.innerHTML = `
                <strong>${project.title}</strong>
                <p>${project.description}</p>
            `;

            item.onclick = () => selectProject(project, item);

            list.appendChild(item);
        });

    } catch (error) {
        showToast("Failed to load projects");
    }
}

/* Select Project */
function selectProject(project, element) {
    selectedProjectId = project._id;

    if (selectedProjectElement) {
        selectedProjectElement.classList.remove("active");
    }

    selectedProjectElement = element;
    selectedProjectElement.classList.add("active");

    document.getElementById("selectedProjectTitle").innerText = project.title;
    document.getElementById("selectedProjectDescription").innerText = project.description;

    document.getElementById("taskFormBox").classList.remove("hide");
    document.getElementById("deleteProjectBtn").classList.remove("hide");

    loadTasks();
}

/* Delete Project */
async function deleteSelectedProject() {
    if (!selectedProjectId) return;

    if (!confirm("Delete this project and its tasks?")) return;

    try {
        const response = await fetch(`${API_URL}/projects/${selectedProjectId}`, {
            method: "DELETE",
            headers: getHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            showToast(data.message || "Project delete failed");
            return;
        }

        selectedProjectId = null;
        selectedProjectElement = null;

        document.getElementById("selectedProjectTitle").innerText = "Select a Project";
        document.getElementById("selectedProjectDescription").innerText = "Choose a project from left side.";
        document.getElementById("taskFormBox").classList.add("hide");
        document.getElementById("deleteProjectBtn").classList.add("hide");

        clearColumns();
        loadProjects();
        showToast("✅ Project deleted");

    } catch (error) {
        showToast("Failed to delete project");
    }
}

/* Create Task */
async function createTask() {
    const title = document.getElementById("taskTitle").value.trim();
    const description = document.getElementById("taskDescription").value.trim();
    const status = document.getElementById("taskStatus").value;

    if (!selectedProjectId) {
        showToast("Select a project first");
        return;
    }

    if (!title || !description) {
        showToast("Please enter task title and description");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({
                title,
                description,
                status,
                project: selectedProjectId
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showToast(data.message || "Task creation failed");
            return;
        }

        document.getElementById("taskTitle").value = "";
        document.getElementById("taskDescription").value = "";
        document.getElementById("taskStatus").value = "Pending";

        showToast("✅ Task created");
        loadTasks();

    } catch (error) {
        showToast("Failed to create task");
    }
}

/* Load Tasks */
async function loadTasks() {
    if (!selectedProjectId) return;

    try {
        const response = await fetch(`${API_URL}/tasks/${selectedProjectId}`, {
            headers: getHeaders()
        });

        const tasks = await response.json();

        clearColumns();

        if (!Array.isArray(tasks)) return;

        tasks.forEach(task => {
            const card = createTaskCard(task);

            if (task.status === "Pending") {
                document.getElementById("pendingTasks").appendChild(card);
            } else if (task.status === "In Progress") {
                document.getElementById("progressTasks").appendChild(card);
            } else {
                document.getElementById("completedTasks").appendChild(card);
            }
        });

    } catch (error) {
        showToast("Failed to load tasks");
    }
}

function clearColumns() {
    document.getElementById("pendingTasks").innerHTML = "";
    document.getElementById("progressTasks").innerHTML = "";
    document.getElementById("completedTasks").innerHTML = "";
}

/* Task Card */
function createTaskCard(task) {
    const card = document.createElement("div");
    card.className = "task-card";

    let commentsHTML = "<small>No comments yet</small>";

    if (task.comments && task.comments.length > 0) {
        commentsHTML = task.comments.map(comment => {
            return `<small>💬 ${comment.text}</small>`;
        }).join("");
    }

    card.innerHTML = `
        <h4>${task.title}</h4>
        <p>${task.description}</p>

        <select id="status-${task._id}">
            <option value="Pending" ${task.status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="In Progress" ${task.status === "In Progress" ? "selected" : ""}>In Progress</option>
            <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>Completed</option>
        </select>

        <button class="update-btn" onclick="updateTask('${task._id}')">Update Status</button>

        <input type="text" id="comment-${task._id}" placeholder="Add comment">

        <button class="comment-btn" onclick="addComment('${task._id}')">Add Comment</button>

        <button class="delete-btn" onclick="deleteTask('${task._id}')">Delete Task</button>

        <div class="comments">${commentsHTML}</div>
    `;

    return card;
}

/* Update Task */
async function updateTask(taskId) {
    const status = document.getElementById(`status-${taskId}`).value;

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({ status })
        });

        const data = await response.json();

        if (!response.ok) {
            showToast(data.message || "Task update failed");
            return;
        }

        showToast("✅ Task updated");
        loadTasks();

    } catch (error) {
        showToast("Failed to update task");
    }
}

/* Add Comment */
async function addComment(taskId) {
    const input = document.getElementById(`comment-${taskId}`);
    const text = input.value.trim();

    if (!text) {
        showToast("Please write a comment");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}/comments`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ text })
        });

        const data = await response.json();

        if (!response.ok) {
            showToast(data.message || "Comment failed");
            return;
        }

        input.value = "";
        showToast("✅ Comment added");
        loadTasks();

    } catch (error) {
        showToast("Failed to add comment");
    }
}

/* Delete Task */
async function deleteTask(taskId) {
    if (!confirm("Delete this task?")) return;

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: "DELETE",
            headers: getHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            showToast(data.message || "Task delete failed");
            return;
        }

        showToast("✅ Task deleted");
        loadTasks();

    } catch (error) {
        showToast("Failed to delete task");
    }
}