import React, { useEffect, useState } from "react";
import { fetchUsers, fetchTasks, createTask, fetchProfile } from "../api/api";
import { getWeekNumber } from "../utils/weekCalculator";

const ManagerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", date: "" });
  const [filterDate, setFilterDate] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    // Fetch manager profile
    fetchProfile(token).then(setProfile);

    // Fetch all users
    fetchUsers(token).then(setUsers);
  }, [token]);

  // Fetch tasks for selected employee (or manager themselves)
  useEffect(() => {
    if (!token) return;

    const userId = selectedUser?.id || profile?.id;
    if (!userId) return;

    fetchTasks(token, null, userId).then(setTasks); // Assuming fetchTasks can accept userId
  }, [token, selectedUser, profile]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!token) return;

    if (!newTask.date) return alert("Please select a date");

    const week = getWeekNumber(new Date(newTask.date));
    const taskPayload = { ...newTask, week };

    const created = await createTask(token, taskPayload);
    if (created.task) {
      setTasks([created.task, ...tasks]);
      setNewTask({ title: "", description: "", date: "" });
    }
  };

  const handleFilter = async () => {
    if (!token) return;

    let week;
    if (filterDate) week = getWeekNumber(new Date(filterDate));

    const userId = selectedUser?.id || profile?.id;
    const filtered = await fetchTasks(token, week, userId); // Assuming fetchTasks supports userId
    setTasks(filtered);
  };

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-3xl font-bold">Manager Dashboard</h2>

      {/* Profile Section */}
      {profile && (
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-xl font-semibold mb-2">My Profile</h3>
          <p><span className="font-medium">Name:</span> {profile.name}</p>
          <p><span className="font-medium">Email:</span> {profile.email}</p>
          <p><span className="font-medium">Role:</span> {profile.role}</p>
        </div>
      )}

      {/* Select Employee */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-xl font-semibold mb-2">Select Employee</h3>
        <select
          value={selectedUser?.id || ""}
          onChange={(e) =>
            setSelectedUser(users.find((u) => u.id === parseInt(e.target.value)))
          }
          className="w-full border border-gray-300 rounded-lg p-2"
        >
          <option value="">-- Myself / All --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      {/* Add Task Section (for manager themselves) */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-xl font-semibold mb-4">Add Task</h3>
        <form onSubmit={handleAddTask} className="space-y-3">
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
          <textarea
            placeholder="Task description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <input
            type="date"
            value={newTask.date}
            onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Add Task
          </button>
        </form>
      </div>

      {/* Task List Section */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-xl font-semibold mb-4">
          {selectedUser ? `${selectedUser.name}'s Tasks` : "My Tasks"}
        </h3>

        {/* Date Filter */}
        <div className="flex gap-2 mb-4">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded-lg p-2"
          />
          <button
            onClick={handleFilter}
            className="bg-gray-700 text-white px-4 rounded hover:bg-gray-800"
          >
            Filter
          </button>
        </div>

        <ul>
          {tasks.map((task) => (
            <li key={task._id} className="border-b py-2">
              <span className="font-medium">{task.title}</span> — {task.week}
              <p className="text-gray-600">{task.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManagerDashboard;
