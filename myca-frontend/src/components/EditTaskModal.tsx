import React, { useState } from "react";
// import { BASE_URL, AUTH_TOKEN } from "../config";
import { BASE_URL } from "../config";


interface EditTaskModalProps {
  task: { id: string; name: string };
  isOpen: boolean;
  onClose: () => void;
  refreshTasks: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, isOpen, onClose, refreshTasks }) => {
  const [newName, setNewName] = useState(task.name);
  const [newType, setNewType] = useState("task"); // Default value
  const [newStatus, setNewStatus] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  if (!isOpen) return null;

  const handleUpdateTask = () => {
    const today = new Date().toISOString().split("T")[0]; // Format date
    const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN");
    const updateData = {
      date: today,
      item_id: task.id,
      new_name: newName,
      new_type: newType, 
      new_status: newStatus,
      isFocused: isFocused,
    };

    fetch(`${BASE_URL}/updateItem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      credentials: "include",
      body: JSON.stringify(updateData),
    })
      .then((response) => response.json())
      .then(() => {
        refreshTasks(); // Refresh task list after update
        onClose(); // Close modal
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2>Edit Task</h2>

        <label>Task Name:</label>
        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} style={inputStyle} />

        <label>Type:</label>
        <select value={newType} onChange={(e) => setNewType(e.target.value)} style={inputStyle}>
          <option value="task">Task</option>
          <option value="note">Note</option>
          <option value="group">Group</option>
          <option value="link">Link</option>
        </select>

        <label>Status:</label>
        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} style={inputStyle}>
          <option value="">Select Status</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancled">Cancled</option>
        </select>

        <label>
          <input type="checkbox" checked={isFocused} onChange={(e) => setIsFocused(e.target.checked)} />
          Focused
        </label>

        <div style={buttonContainerStyle}>
          <button onClick={handleUpdateTask} style={saveButtonStyle}>Save</button>
          <button onClick={onClose} style={cancelButtonStyle}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// 🔹 Missing Styles
const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  width: "400px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  margin: "5px 0",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const buttonContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "10px",
};

const saveButtonStyle: React.CSSProperties = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "10px",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
};

const cancelButtonStyle: React.CSSProperties = {
  backgroundColor: "#dc3545",
  color: "white",
  padding: "10px",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
};

export default EditTaskModal;
