import { deleteTask, updateTask } from "../api/api"; // adjust path
import React, { useEffect, useState } from "react";
import { fetchTasks, createTask, fetchProfile } from "../api/api";
import { getWeekNumber } from "../utils/weekCalculator";

const EmployeeDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: "",
  });
  const [filterDate, setFilterDate] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const [editingTask, setEditingTask] = useState(null); // holds task being edited
  const [editValues, setEditValues] = useState({ title: "", description: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    setIsLoading(true);
    Promise.all([fetchProfile(token), fetchTasks(token)])
      .then(([profileData, tasksData]) => {
        setProfile(profileData);
        setTasks(tasksData);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleUpdateTask = async (id) => {
    try {
      const updated = await updateTask(token, id, editValues); // API call
      setTasks(
        tasks.map((t) => (t._id === id ? { ...t, ...updated.task } : t))
      ); // update state
      setEditingTask(null); // close modal
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const updated = await updateTask(token, id, { completed }); // ✅ Calls API
      setTasks( 

        tasks.map((t) => (t._id === id ? { ...t, completed: updated.task.completed } : t)) // update state
      ); 
    } catch (err) {
      console.error("Error toggling task completion:", err);
    }
  }




  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(token, id); // ✅ Calls API
      setTasks(tasks.filter((t) => t._id !== id)); // ✅ Update state instantly
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!newTask.date) return alert("Please select a date");

    const week = getWeekNumber(new Date(newTask.date));
    setIsLoading(true);

    try {
      const created = await createTask(token, { ...newTask, week });
      if (created.task) {
        setTasks([created.task, ...tasks]);
        setNewTask({ title: "", description: "", date: "" });
      }
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let week;
    if (filterDate) week = getWeekNumber(new Date(filterDate));

    setIsLoading(true);
    try {
      const filtered = await fetchTasks(token, week);
      setTasks(filtered);
    } catch (error) {
      console.error("Error filtering tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilter = async () => {
    setFilterDate("");
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoading(true);
    try {
      const allTasks = await fetchTasks(token);
      setTasks(allTasks);
    } catch (error) {
      console.error("Error clearing filter:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return !task.completed;
    if (activeTab === "completed") return task.completed;
    return true;
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-3 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center py-6 mb-8 border-b border-purple-200">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 sm:mb-0">
            Employee{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              Dashboard
            </span>
          </h1>
          {profile && (
            <div className="flex items-center space-x-4 bg-white rounded-xl py-3 px-5 shadow-lg border border-purple-100">
              <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {profile.name}
                </p>
                <p className="text-xs text-purple-600 capitalize">
                  {profile.role}
                </p>
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Add Task */}
          <div className="lg:col-span-1 space-y-4">
            {/* Profile Card */}
            {profile && (
              <section className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-3 border-b border-purple-100 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-purple-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Profile
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center p-3 rounded-lg bg-purple-50">
                    <div className="w-5 text-purple-600 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-800 font-medium">{profile.name}</p>
                  </div>
                  <div className="flex items-center p-3 rounded-lg bg-purple-50">
                    <div className="w-5 text-purple-600 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <p className="text-gray-800 font-medium">{profile.email}</p>
                  </div>
                  <div className="flex items-center p-3 rounded-lg bg-purple-50">
                    <div className="w-5 text-purple-600 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3a2 2 0 01-2 2h-1v-1a2 2 0 00-2-2H9a2 2 0 00-2 2v1H6a2 2 0 01-2-2V8a2 2 0 012-2zm0 5h8a1 1 0 011 1v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-1a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-800 font-medium capitalize">
                      {profile.role}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Add Task Card */}
            <section className="bg-white rounded-2xl shadow-lg p-4 border border-purple-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center justify-between">
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-pink-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add New Task
                </span>

                {/* Calendar Icon with Date Picker */}
                <label className="relative cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600 hover:text-purple-800 transition"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <input
                    type="date"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    value={newTask.date}
                    onChange={(e) =>
                      setNewTask({ ...newTask, date: e.target.value })
                    }
                  />
                </label>
              </h2>

              <form onSubmit={handleAddTask} className="space-y-5">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Task Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    className="w-full border border-purple-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-white"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    placeholder="Enter task description"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    rows={3}
                    className="w-full border border-purple-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Adding Task...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Add Task
                    </>
                  )}
                </button>
              </form>
            </section>
          </div>

          {/* Right Column - Task List */}
<div className="lg:col-span-2">
  <section className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2 text-purple-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z"
            clipRule="evenodd"
          />
        </svg>
        My Tasks
      </h2>

      {/* Filter Section */}
      <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="flex">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="flex-1 border border-purple-200 rounded-l-xl p-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-white"
          />
          <button
            onClick={handleFilter}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-r-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-colors duration-200"
          >
            Filter
          </button>
        </div>
        <button
          onClick={handleClearFilter}
          disabled={isLoading}
          className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:from-gray-300 hover:to-gray-400 disabled:opacity-50 transition-colors duration-200"
        >
          Clear
        </button>
      </div>
    </div>

    {/* Task Status Tabs */}
    <div className="border-b border-purple-100 mb-6">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => setActiveTab("all")}
          className={`py-3 px-1 border-b-2 font-medium text-sm ${
            activeTab === "all"
              ? "border-purple-500 text-purple-600"
              : "border-transparent text-gray-500 hover:text-purple-700 hover:border-purple-300"
          }`}
        >
          All Tasks
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`py-3 px-1 border-b-2 font-medium text-sm ${
            activeTab === "pending"
              ? "border-pink-500 text-pink-600"
              : "border-transparent text-gray-500 hover:text-pink-700 hover:border-pink-300"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`py-3 px-1 border-b-2 font-medium text-sm ${
            activeTab === "completed"
              ? "border-green-500 text-green-600"
              : "border-transparent text-gray-500 hover:text-green-700 hover:border-green-300"
          }`}
        >
          Completed
        </button>
      </nav>
    </div>

    {/* Task List */}
    {isLoading ? (
      <div className="flex justify-center items-center py-12">
        <svg
          className="animate-spin h-8 w-8 text-purple-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    ) : filteredTasks.length > 0 ? (
      <ul className="space-y-4">
        {filteredTasks.map((task) => (
          <li
            key={task._id}
            className={`p-5 rounded-xl transition-all duration-300 transform hover:scale-[1.01] ${
              task.completed
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 shadow-sm"
                : "bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 shadow-md"
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4 mt-1">
                <div 
                  onClick={() => handleToggleComplete(task._id, !task.completed)}
                  className={`h-6 w-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                    task.completed
                      ? "bg-green-500 border-green-500 shadow-inner"
                      : "bg-white border-pink-400 hover:border-pink-500 shadow-sm"
                  }`}
                >
                  {task.completed && (
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <span
                    className={`text-lg font-semibold ${
                      task.completed
                        ? "text-gray-500 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 shadow-sm">
                      Week {task.week}
                    </span>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setEditValues({
                            title: task.title,
                            description: task.description || "",
                          });
                        }}
                        className="p-2 rounded-lg bg-white border border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200 shadow-sm"
                        title="Edit task"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536M9 13h3l7-7a1.5 1.5 0 00-2.121-2.121l-7 7v3z"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="p-2 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 shadow-sm"
                        title="Delete task"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                {task.description && (
  <div className="mt-2 flex justify-between items-center">
    <p className="text-gray-600 text-sm pl-2 border-l-2 border-purple-200">
      {task.description}
    </p>
    <span
      className={`ml-3 text-xs font-medium px-2 py-1 rounded-full ${
        task.completed
          ? "bg-green-100 text-green-800"
          : "bg-pink-100 text-pink-800"
      }`}
    >
      {task.completed ? "Completed" : "Pending"}
    </span>
  </div>
)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="h-12 w-12 text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No tasks found
        </h3>
        <p className="mt-2 text-gray-500 max-w-md mx-auto">
          {activeTab !== "all"
            ? `You don't have any ${activeTab} tasks. Try changing filters or create a new task.`
            : "Get started by creating your first task above."}
        </p>
        {activeTab !== "all" && (
          <button
            onClick={handleClearFilter}
            className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors duration-200"
          >
            Clear Filters
          </button>
        )}
      </div>
    )}
  </section>
</div>
        </div>
      </div>
      {editingTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Edit Task
            </h2>

            <input
              type="text"
              value={editValues.title}
              onChange={(e) =>
                setEditValues({ ...editValues, title: e.target.value })
              }
              className="w-full border border-purple-200 rounded-lg p-2 mb-3"
            />
            <textarea
              value={editValues.description}
              onChange={(e) =>
                setEditValues({ ...editValues, description: e.target.value })
              }
              rows={3}
              className="w-full border border-purple-200 rounded-lg p-2 mb-4"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateTask(editingTask._id)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default EmployeeDashboard;
