import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user info from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const role = localStorage.getItem("role") || "employee"; // fallback
    setUser({ role });
    fetchTasks(role, token);
  }, []);

  // Fetch tasks from API
  const fetchTasks = async (role, token) => {
    try {
      const url = role === "manager" ? "/api/tasks" : "/api/tasks/my";
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  // Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTask }),
      });
      const data = await res.json();
      if (data.task) {
        setTasks([...tasks, data.task]);
        setNewTask("");
      }
    } catch (err) {
      console.error("Error adding task", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {user && (
        <div className="mb-6 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p>Role: {user.role}</p>
        </div>
      )}

      {/* Add Task */}
      <div className="mb-6 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Add Task</h2>
        <form onSubmit={handleAddTask} className="flex gap-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter new task"
            className="flex-1 border rounded-lg p-2"
            required
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Add
          </button>
        </form>
      </div>

      {/* View Tasks */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          {user?.role === "manager" ? "All Tasks" : "My Tasks"}
        </h2>
        <ul className="space-y-2">
          {tasks.map((task, idx) => (
            <li
              key={idx}
              className="p-3 border rounded-lg bg-gray-50 flex justify-between"
            >
              <span>{task.title}</span>
              <span className="text-gray-500 text-sm">
                {task.assignedTo || "Me"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;