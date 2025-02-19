import React, { useState } from "react";

const TaskInput: React.FC<{ addTask: (name: string) => void }> = ({ addTask }) => {
  const [taskName, setTaskName] = useState("");

  const handleAddTask = () => {
    if (taskName.trim()) {
      addTask(taskName);
      setTaskName("");
    }
  };

  return (
    <div style={{ padding: "20px", borderBottom: "1px solid #ddd" }}>
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Add a new task..."
        style={{
          padding: "10px",
          width: "100%",
          borderRadius: "6px",
          border: "1px solid #ccc",
          outline: "none",
          fontSize: "16px",
        }}
      />
      <button 
        onClick={handleAddTask} 
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "10px",
          marginTop: "10px",
          borderRadius: "6px",
          width: "100%",
          border: "none",
          fontSize: "16px",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        Add Task
      </button>
    </div>
  );
};

export default TaskInput;
