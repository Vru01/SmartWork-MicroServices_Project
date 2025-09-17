const API_GATEWAY = "http://localhost:5000";

// ====================== AUTH ======================
export const login = async (email, password) => {
  const res = await fetch(`${API_GATEWAY}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const signup = async (name, email, password, role) => {
  const res = await fetch(`${API_GATEWAY}/api/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role })
  });
  return res.json();
};

// ====================== USERS ======================
export const fetchUsers = async (token) => {
  const res = await fetch(`${API_GATEWAY}/api/users`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
};

export const fetchProfile = async (token) => {
  const res = await fetch(`${API_GATEWAY}/api/users/profile`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
};


// ====================== TASKS ======================
export const fetchTasks = async (token, week = "") => {
  let url = `${API_GATEWAY}/api/tasks`;
  if (week) url += `?week=${week}`;

  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
};

export const createTask = async (token, { title, description, week }) => {
  const res = await fetch(`${API_GATEWAY}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ title, description, week })
  });
  return res.json();
};

// ✅ Update task (employee can update only their own, manager can update all)
export const updateTask = async (token, id, { title, description, week }) => {
  const res = await fetch(`${API_GATEWAY}/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ title, description, week })
  });
  return res.json();
};

// ✅ Delete task (employee can delete only their own, manager can delete all)
export const deleteTask = async (token, id) => {
  const res = await fetch(`${API_GATEWAY}/api/tasks/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
};

