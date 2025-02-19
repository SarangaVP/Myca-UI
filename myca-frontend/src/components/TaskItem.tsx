import React, { useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import TaskInput from "./TaskInput";

interface Task {
  id: string;
  name: string;
  children?: Task[];
}

interface TaskItemProps {
  task: Task;
  refreshTasks: () => void;
  onEditTask: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, refreshTasks, onEditTask }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingChild, setIsAddingChild] = useState(false);

  return (
    <div style={taskContainerStyle}>
      <div style={taskRowStyle}>
        {/* Expand/Collapse Button */}
        {task.children && task.children.length > 0 && (
          <button onClick={() => setIsExpanded(!isExpanded)} style={toggleButtonStyle}>
            {isExpanded ? "▼" : "▶"}
          </button>
        )}

        <span style={taskTextStyle}>{task.name}</span>

        {/* Add Child Task Button */}
        <button onClick={() => setIsAddingChild(!isAddingChild)} style={addButtonStyle}>
          <FaPlus /> 
        </button>

        {/* Edit Task Button */}
        <button onClick={() => onEditTask(task)} style={editButtonStyle}>
          <FaEdit /> Edit
        </button>
      </div>

      {/* Task Input for Adding a Child Task */}
      {isAddingChild && (
        <TaskInput refreshTasks={refreshTasks} parentId={task.id} onClose={() => setIsAddingChild(false)} />
      )}

      {/* Show Child Tasks */}
      {isExpanded && task.children && (
        <div style={childTaskContainerStyle}>
          {task.children.map((child) => (
            <TaskItem key={child.id} task={child} refreshTasks={refreshTasks} onEditTask={onEditTask} />
          ))}
        </div>
      )}
    </div>
  );
};

// 🔹 Styles
const taskContainerStyle: React.CSSProperties = {
  padding: "12px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
  marginBottom: "8px",
  transition: "0.3s ease-in-out",
};

const taskRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 12px",
  borderRadius: "6px",
  backgroundColor: "#f8f9fa",
  cursor: "pointer",
};

const taskTextStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "bold",
  flex: 1,
  marginLeft: "8px",
};

const toggleButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
  marginRight: "8px",
};

const addButtonStyle: React.CSSProperties = {
  backgroundColor: "#28a745",
  color: "white",
  padding: "6px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  transition: "0.2s ease-in-out",
};

const editButtonStyle: React.CSSProperties = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "6px 12px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  transition: "0.2s ease-in-out",
};

const childTaskContainerStyle: React.CSSProperties = {
  paddingLeft: "20px",
  marginTop: "8px",
  borderLeft: "2px solid #ccc",
};

export default TaskItem;
