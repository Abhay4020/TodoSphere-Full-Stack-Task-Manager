// API Configuration
// const API_BASE = "https://todosphere-knws.onrender.com";
const API_BASE = window.location.origin;
const API_URL = API_BASE + "/api";   

let currentUser = null;
let authToken = null;

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// Check if user is already logged in
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');

    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        showApp();
        loadTodos();
    } else {
        showAuth();
    }
}

// Switch between login and register tabs
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.auth-tab');

    tabs.forEach(t => t.classList.remove('active'));

    if (tab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        tabs[0].classList.add('active');
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        tabs[1].classList.add('active');
    }
}

// Handle user registration
async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    const btn = event.target.querySelector('.btn');
    btn.disabled = true;
    btn.textContent = 'Registering...';

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (data.success) {
            authToken = data.token;
            currentUser = data.user;
            
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            showAlert('Registration successful! Welcome!', 'success');
            
            setTimeout(() => {
                showApp();
                loadTodos();
            }, 1000);
        } else {
            showAlert(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Network error. Please check if the server is running.', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Register';
    }
}

// Handle user login
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const btn = event.target.querySelector('.btn');
    btn.disabled = true;
    btn.textContent = 'Logging in...';

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            authToken = data.token;
            currentUser = data.user;
            
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            showAlert('Login successful! Welcome back!', 'success');
            
            setTimeout(() => {
                showApp();
                loadTodos();
            }, 1000);
        } else {
            showAlert(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Network error. Please check if the server is running.', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Login';
    }
}

// Handle user logout
function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    authToken = null;
    currentUser = null;
    showAlert('Logged out successfully', 'success');
    setTimeout(() => {
        showAuth();
    }, 1000);
}

// Show authentication container
function showAuth() {
    document.getElementById('authContainer').style.display = 'block';
    document.getElementById('appContainer').classList.remove('active');
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
}

// Show main app container
function showApp() {
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('appContainer').classList.add('active');
    
    // Update user info
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.username;
        document.getElementById('userEmail').textContent = currentUser.email;
        document.getElementById('userAvatar').textContent = currentUser.username.charAt(0).toUpperCase();
    }
}

// Load all todos
async function loadTodos() {
    try {
        const response = await fetch(`${API_URL}/todos`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();

        if (data.success) {
            displayTodos(data.todos);
        } else {
            showAlert('Failed to load todos', 'error');
        }
    } catch (error) {
        console.error('Load todos error:', error);
        showAlert('Network error while loading todos', 'error');
    }
}

// Display todos in the UI
function displayTodos(todos) {
    const todoList = document.getElementById('todoList');
    const todoStats = document.getElementById('todoStats');

    if (todos.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3>No tasks yet</h3>
                <p>Add your first task to get started!</p>
            </div>
        `;
        todoStats.textContent = '0 tasks';
        return;
    }

    const completedCount = todos.filter(t => t.completed).length;
    todoStats.textContent = `${todos.length} tasks (${completedCount} completed)`;

    todoList.innerHTML = todos.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo._id}">
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo('${todo._id}', this.checked)"
            >
            <div class="todo-content">
                <div class="todo-title">${escapeHtml(todo.title)}</div>
                ${todo.description ? `<div class="todo-description">${escapeHtml(todo.description)}</div>` : ''}
            </div>
            <div class="todo-actions">
                <button class="edit-btn" onclick="editTodo('${todo._id}')">Edit</button>
                <button class="delete-btn" onclick="deleteTodo('${todo._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Add new todo
async function handleAddTodo(event) {
    event.preventDefault();

    const title = document.getElementById('todoTitle').value.trim();
    const description = document.getElementById('todoDescription').value.trim();

    if (!title) {
        showAlert('Please enter a task title', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ title, description })
        });

        const data = await response.json();

        if (data.success) {
            showAlert('Task added successfully!', 'success');
            document.getElementById('todoTitle').value = '';
            document.getElementById('todoDescription').value = '';
            loadTodos();
        } else {
            showAlert(data.message || 'Failed to add task', 'error');
        }
    } catch (error) {
        console.error('Add todo error:', error);
        showAlert('Network error while adding task', 'error');
    }
}

// Toggle todo completion
async function toggleTodo(id, completed) {
    try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ completed })
        });

        const data = await response.json();

        if (data.success) {
            loadTodos();
        } else {
            showAlert('Failed to update task', 'error');
            loadTodos();
        }
    } catch (error) {
        console.error('Toggle todo error:', error);
        showAlert('Network error while updating task', 'error');
        loadTodos();
    }
}

// Edit todo
async function editTodo(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    const titleElement = todoItem.querySelector('.todo-title');
    const descriptionElement = todoItem.querySelector('.todo-description');

    const currentTitle = titleElement.textContent;
    const currentDescription = descriptionElement ? descriptionElement.textContent : '';

    const newTitle = prompt('Edit task title:', currentTitle);
    
    if (newTitle === null) return; // User cancelled
    
    if (!newTitle.trim()) {
        showAlert('Task title cannot be empty', 'error');
        return;
    }

    const newDescription = prompt('Edit task description:', currentDescription);

    try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ 
                title: newTitle.trim(), 
                description: newDescription ? newDescription.trim() : ''
            })
        });

        const data = await response.json();

        if (data.success) {
            showAlert('Task updated successfully!', 'success');
            loadTodos();
        } else {
            showAlert(data.message || 'Failed to update task', 'error');
        }
    } catch (error) {
        console.error('Edit todo error:', error);
        showAlert('Network error while updating task', 'error');
    }
}

// Delete todo
async function deleteTodo(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();

        if (data.success) {
            showAlert('Task deleted successfully!', 'success');
            loadTodos();
        } else {
            showAlert(data.message || 'Failed to delete task', 'error');
        }
    } catch (error) {
        console.error('Delete todo error:', error);
        showAlert('Network error while deleting task', 'error');
    }
}

// Show alert message
function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 4000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
// ================= PROFILE FUNCTIONS =================

// Open Profile Modal
async function openProfile() {
    try {
        const res = await fetch(`${API_URL}/auth/profile`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });

        const data = await res.json();

        if (data.success) {
            document.getElementById("pUsername").textContent = data.user.username;
            document.getElementById("pEmail").textContent = data.user.email;

            document.getElementById("profileModal").style.display = "flex";
        } else {
            showAlert("Failed to load profile", "error");
        }

    } catch (err) {
        console.error("Profile error:", err);
        showAlert("Error loading profile", "error");
    }
}

// Close Profile Modal
function closeProfile() {
    document.getElementById("profileModal").style.display = "none";
}

