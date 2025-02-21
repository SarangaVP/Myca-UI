import React, { useState, useEffect } from "react";
import { BASE_URL, AUTH_TOKEN } from "../config";

interface EditTaskModalProps {
  task: { 
    id: string; 
    name: string;
    isFocused: boolean; 
    context?: {
      name: string;
      itype: string;
      status: string;
    };
  };
  isOpen: boolean;
  onClose: () => void;
  refreshTasks: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, isOpen, onClose, refreshTasks }) => {
  const [newName, setNewName] = useState(task.name);
  const [newType, setNewType] = useState(task.context?.itype || "");
  const [newStatus, setNewStatus] = useState(task.context?.status || "");
  const [isFocused, setIsFocused] = useState(task.isFocused || false); 

  useEffect(() => {
    setNewName(task.name);
    setNewType(task.context?.itype || "");
    setNewStatus(task.context?.status || "");
    setIsFocused(task.isFocused || false); 
  }, [task]);

  if (!isOpen) return null;

  const handleUpdateTask = () => {
    const today = new Date().toISOString().split("T")[0]; 
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
        refreshTasks(); 
        onClose(); 
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2>Edit Task</h2>

        <label>Task Name:</label>
        <input 
          type="text" 
          value={newName} 
          onChange={(e) => setNewName(e.target.value)} 
          style={inputStyle} 
        />

        <label>Type:</label>
        <select 
          value={newType} 
          onChange={(e) => setNewType(e.target.value)} 
          style={inputStyle}
        >
          <option value="">Select Type</option>
          <option value="task">Task</option>
          <option value="note">Note</option>
          <option value="group">Group</option>
          <option value="link">Link</option>
        </select>

        <label>Status:</label>
        <select 
          value={newStatus} 
          onChange={(e) => setNewStatus(e.target.value)} 
          style={inputStyle}
        >
          <option value="">Select Status</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>

        <div style={{ marginTop: "10px" }}>
          <input 
            type="checkbox" 
            checked={isFocused} 
            onChange={(e) => setIsFocused(e.target.checked)} 
            id="focus-checkbox"
          />
          <label htmlFor="focus-checkbox" style={{ marginLeft: "5px" }}> Focused</label>
        </div>

        <div style={buttonContainerStyle}>
          <button onClick={handleUpdateTask} style={saveButtonStyle}>Save</button>
          <button onClick={onClose} style={cancelButtonStyle}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Styles
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
