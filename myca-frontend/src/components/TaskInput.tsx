import React, { useState } from "react";
import { BASE_URL, AUTH_TOKEN } from "../config.ts";

const TaskInput: React.FC<{ refreshTasks: () => void }> = ({ refreshTasks }) => {
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState("task"); // Default type
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTask = async () => {
    if (!taskName.trim()) return;

    setLoading(true);
    setError(null);

    const requestBody = {
      date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD
      item_name: taskName,
      item_type: taskType, // Send selected type
      item_status: "running",
      parent_item_id: "",
      note: "",
    };

    try {
      const response = await fetch(`${BASE_URL}/createNewItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok && data.status === 200) {
        setTaskName("");
        setTaskType("task"); // Reset type to default
        refreshTasks(); // Refresh task list
      } else {
        throw new Error("Failed to add task");
      }
    } catch (err) {
      setError("Error adding task. Please try again.");
      console.error("Task creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={taskInputContainerStyle}>
      <div style={inputRowStyle}>
        {/* Task Name Input */}
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Task name..."
          style={inputStyle}
          disabled={loading}
        />

        {/* Task Type Dropdown */}
        <select
          value={taskType}
          onChange={(e) => setTaskType(e.target.value)}
          style={dropdownStyle}
          disabled={loading}
        >
          <option value="task">Task</option>
          <option value="note">Note</option>
          <option value="group">Group</option>
          <option value="link">Link</option>
        </select>

        {/* Add Button */}
        <button onClick={handleAddTask} style={addButtonStyle} disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {error && <p style={errorTextStyle}>{error}</p>}
    </div>
  );
};

// 🔹 **Styles**
const taskInputContainerStyle: React.CSSProperties = {
  padding: "15px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
};

const inputRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  outline: "none",
  fontSize: "16px",
};

const dropdownStyle: React.CSSProperties = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  backgroundColor: "#fff",
  fontSize: "16px",
  cursor: "pointer",
};

const addButtonStyle: React.CSSProperties = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "10px 15px",
  borderRadius: "6px",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "0.2s ease-in-out",
};

const errorTextStyle: React.CSSProperties = {
  color: "red",
  fontSize: "14px",
  marginTop: "5px",
};

export default TaskInput;
