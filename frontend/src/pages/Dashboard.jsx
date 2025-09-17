import React from "react";

export default function Dashboard() {
  // Later we’ll fetch from token; for now just placeholder
  const user = { name: "John Doe", email: "john@email.com", role: "Manager" };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-100 p-4 rounded shadow mb-4">
        <h2 className="text-xl font-bold mb-2">Profile</h2>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>

      <button className="bg-green-600 text-white px-4 py-2 rounded mb-4">
        Add Task
      </button>

      {user.role === "Manager" ? (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">Employee Task List</h3>
          <p>Task list will appear here...</p>
        </div>
      ) : (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">My Tasks</h3>
          <p>Your tasks will appear here...</p>
        </div>
      )}
    </div>
  );
}
