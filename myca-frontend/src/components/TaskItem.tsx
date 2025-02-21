import React, { useState } from "react";
import { FaEdit, FaPlus, FaStar, FaSyncAlt } from "react-icons/fa";
import TaskInput from "./TaskInput";
import RecurrenceModal from "./RecurrenceModal"; // Import Recurrence Modal

export interface Task {
  id: string;
  name: string;
  isFocused: boolean;
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
  const [isRecurrenceModalOpen, setIsRecurrenceModalOpen] = useState(false); // State for Recurrence Modal

  return (
    <div style={taskContainerStyle}>
      <div style={taskRowStyle}>
        {/* Expand/Collapse Button */}
        {task.children && task.children.length > 0 && (
          <button onClick={() => setIsExpanded(!isExpanded)} style={toggleButtonStyle}>
            {isExpanded ? "▼" : "▶"}
          </button>
        )}

        {/* Task Name with Star Icon for Focused Items */}
        <span style={taskTextStyle}>
          {task.name} 
          {task.isFocused && <FaStar style={starIconStyle} />}
        </span>

        {/* Recurrence Icon */}
        <button onClick={() => setIsRecurrenceModalOpen(true)} style={recurrenceButtonStyle}>
          <FaSyncAlt /> 
        </button>

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

      {/* Recurrence Modal */}
      {isRecurrenceModalOpen && (
        <RecurrenceModal 
          isOpen={isRecurrenceModalOpen} 
          onClose={() => setIsRecurrenceModalOpen(false)} 
          task={task} 
        />
      )}
    </div>
  );
};

// Styles
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
  display: "flex",
  alignItems: "center",
  gap: "5px",
};

const starIconStyle: React.CSSProperties = {
  color: "#FFA500", 
  marginLeft: "5px",
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
  marginRight: "5px",
};

const recurrenceButtonStyle: React.CSSProperties = {
  backgroundColor: "#17a2b8",
  color: "white",
  padding: "6px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  transition: "0.2s ease-in-out",
  marginRight: "5px",
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
