import React, { useState } from "react";
import { BASE_URL } from "../config";


const TaskInput: React.FC<{ refreshTasks: () => void; parentId?: string; onClose?: () => void }> = ({
  refreshTasks,
  parentId = "",
  onClose,
}) => {
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState("task");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTask = async () => {
    if (!taskName.trim()) return;

    setLoading(true);
    setError(null);

    const token = localStorage.getItem("AUTH_TOKEN");

    if (!token) {
      setError("Authentication token is missing. Please log in again.");
      setLoading(false);
      return;
    }

    const requestBody = {
      date: new Date().toISOString().split("T")[0],
      item_name: taskName,
      item_type: taskType,
      item_status: "running",
      parent_item_id: parentId,
      note: taskType === "link" ? note : "", 
    };

    try {
      const response = await fetch(`${BASE_URL}/createNewItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok && data.status === 200) {
        setTaskName("");
        setTaskType("task");
        setNote(""); 
        refreshTasks();
        if (onClose) onClose();
      } else {
        throw new Error(data.message || "Failed to add task");
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
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Name"
          style={inputStyle}
          disabled={loading}
        />

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

        <button onClick={handleAddTask} style={addButtonStyle} disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {taskType === "link" && (
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Link"
          style={noteInputStyle}
          disabled={loading}
        />
      )}

      {error && <p style={errorTextStyle}>{error}</p>}
    </div>
  );
};

// Styles
const taskInputContainerStyle: React.CSSProperties = {
  marginTop: "10px",
  padding: "10px",
  backgroundColor: "#fff",
  borderRadius: "6px",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
};

const inputRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  outline: "none",
  fontSize: "14px",
};

const dropdownStyle: React.CSSProperties = {
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  backgroundColor: "#fff",
  fontSize: "14px",
};

const addButtonStyle: React.CSSProperties = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "8px 12px",
  borderRadius: "4px",
  border: "none",
  fontSize: "14px",
  cursor: "pointer",
};

const noteInputStyle: React.CSSProperties = {
  marginTop: "8px",
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  outline: "none",
  fontSize: "14px",
  width: "100%",
};

const errorTextStyle: React.CSSProperties = {
  color: "red",
  fontSize: "12px",
};

export default TaskInput;
